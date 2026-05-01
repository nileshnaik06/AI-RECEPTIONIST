const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String, // "2026-05-03"
      required: true,
    },
    time: {
      type: String, // "10:30 AM"
      required: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    sessionId: {
      type: String, // links back to chat session
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index to check conflicts fast
AppointmentSchema.index({ tenantId: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
