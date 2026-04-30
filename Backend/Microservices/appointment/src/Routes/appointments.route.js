const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
} = require('../controller/appointmentController');

const jwtAuth = require('../middleware/jwtAuth');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Widget route — protected by API key (called from chat system)
router.post('/', apiKeyAuth, createAppointment);

// Admin routes — protected by JWT
router.get('/', jwtAuth, getAllAppointments);
router.get('/available-slots', jwtAuth, getAvailableSlots);
router.get('/:id', jwtAuth, getAppointmentById);
router.patch('/:id/status', jwtAuth, updateAppointmentStatus);
router.delete('/:id', jwtAuth, deleteAppointment);

module.exports = router;
