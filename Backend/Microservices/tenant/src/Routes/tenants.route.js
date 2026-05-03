const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  regenerateApiKey,
} = require("../controllers/tenant.controller");

const { authenticate } = require("../Middlewares/auth.middleware");
const { verifyApiKey } = require("../Middlewares/apiKey.middleware");
const crypto = require("crypto");
const Tenant = require("../model/tenant.model");
const asyncHandler = require("../utils/asyncHandler");

// ── JWT protected routes (admin dashboard) ────────────────────
// All these require a JWT token from the centralized AUTH service
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/regenerate-api-key", authenticate, regenerateApiKey);

// ── API key protected route (widget / AI system) ───────────────
// Used by internal services (Chat, FAQ, etc.) to fetch clinic information
// ⚠️  NO middleware here to avoid circular dependency - verification happens in handler
router.get("/clinic-info", asyncHandler(async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "API key missing" });
  }

  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  const tenant = await Tenant.findOne({ apiKey: hashedKey }).select("+apiKey");

  if (!tenant) {
    return res.status(403).json({ success: false, message: "Invalid API key" });
  }

  if (!tenant.isActive) {
    return res.status(403).json({ success: false, message: "Account is deactivated" });
  }

  res.json({
    success: true,
    data: {
      user_id: tenant.user_id,
      clinicName: tenant.clinicName,
      phone: tenant.phone,
      workingHrs: tenant.workingHrs,
      services: tenant.services,
      welcomeMsg: tenant.welcomeMsg,
    },
  });
}));

module.exports = router;