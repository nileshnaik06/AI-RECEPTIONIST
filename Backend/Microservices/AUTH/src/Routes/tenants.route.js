// routes/tenant.routes.js
const express = require("express");
const router = express.Router();

const {
  registerTenant,
  loginTenant,
} = require("../controllers/tenant.controller");

const { verifyApiKey } = require("../middleware/apiKey.middleware");
const { authenticate } = require("../middleware/auth.middleware");

// Public
router.post("/register", registerTenant);
router.post("/login", loginTenant);

// Protected via JWT
router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Tenant profile" });
});

// Protected via API key (for AI system)
router.get("/ai-access", verifyApiKey, (req, res) => {
  res.json({
    message: "Access granted",
    clinic: req.tenant.details.clinicName,
  });
});

module.exports = router;