const Appointment = require('../model/appointment.model');

// Available time slots — hardcoded for MVP
const AVAILABLE_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

// GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    const filter = { tenantId: req.tenant._id };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/admin/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      tenantId: req.tenant._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/appointments  (called by widget/chat system)
const createAppointment = async (req, res) => {
  try {
    const { patientName, phone, date, time, service, sessionId, notes } = req.body;

    // Validate required fields
    if (!patientName || !date || !time || !service) {
      return res.status(400).json({
        success: false,
        message: 'patientName, date, time and service are required',
      });
    }

    // Validate time slot
    if (!AVAILABLE_SLOTS.includes(time)) {
      return res.status(400).json({
        success: false,
        message: `Invalid time slot. Available slots: ${AVAILABLE_SLOTS.join(', ')}`,
      });
    }

    // Conflict check — same clinic, same date, same time
    const conflict = await Appointment.findOne({
      tenantId: req.tenant._id,
      date,
      time,
      status: { $ne: 'cancelled' }, // cancelled slots are free again
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Slot ${time} on ${date} is already booked. Please choose another time.`,
        availableSlots: AVAILABLE_SLOTS,
      });
    }

    const appointment = await Appointment.create({
      tenantId: req.tenant._id,
      patientName,
      phone: phone || '',
      date,
      time,
      service,
      sessionId: sessionId || '',
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PATCH /api/admin/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, confirmed or cancelled',
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenant._id },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/admin/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenant._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/admin/appointments/available-slots?date=2026-05-03
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'date query param required' });
    }

    // Find booked slots for this date
    const booked = await Appointment.find({
      tenantId: req.tenant._id,
      date,
      status: { $ne: 'cancelled' },
    }).select('time');

    const bookedTimes = booked.map((a) => a.time);
    const available = AVAILABLE_SLOTS.filter((slot) => !bookedTimes.includes(slot));

    res.json({ success: true, date, available, booked: bookedTimes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
};
