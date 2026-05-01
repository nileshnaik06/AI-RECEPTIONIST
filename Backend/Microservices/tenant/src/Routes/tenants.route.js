const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  regenerateApiKey,
} = require("../controllers/tenant.controller");

const { authenticate } = require("../Middlewares/auth.middleware");
const { verifyApiKey } = require("../Middlewares/apiKey.middleware");

// ── JWT protected routes (admin dashboard) ────────────────────
// All these require a JWT token from the centralized AUTH service
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/regenerate-api-key", authenticate, regenerateApiKey);

// ── API key protected route (widget / AI system) ───────────────
// Used by the chatbot widget to fetch public clinic information
router.get("/clinic-info", verifyApiKey, (req, res) => {
  // req.tenant contains clinic data verified by apiKey middleware
  res.json({
    success: true,
    data: {
      user_id: req.tenant.user_id,
      clinicName: req.tenant.clinicName,
      phone: req.tenant.phone,
      workingHrs: req.tenant.workingHrs,
      services: req.tenant.services,
      welcomeMsg: req.tenant.welcomeMsg,
    },
  });
});

module.exports = router;