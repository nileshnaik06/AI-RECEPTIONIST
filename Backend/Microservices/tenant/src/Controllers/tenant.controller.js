// controllers/tenant.controller.js
const Tenant = require("../model/tenant.model");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateApiKey,
  hashApiKey,
} = require("../services/auth.service");

const asyncHandler = require("../utils/asyncHandler");

exports.registerTenant = asyncHandler(async (req, res) => {
  const {
    docName,
    email,
    password,
    clinicName,
    address,
    phone,
    workingHrs,
    services,
    welcomeMsg,
  } = req.body;

  // Check existing
  const exists = await Tenant.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Tenant already exists" });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate API key
  const rawApiKey = generateApiKey();
  const hashedApiKey = hashApiKey(rawApiKey);

  const tenant = await Tenant.create({
    docName,
    email,
    password: hashedPassword,
    apiKey: hashedApiKey,
    details: {
      clinicName,
      address,
      phone,
      workingHrs,
      services,
      welcomeMsg,
    },
  });

  res.status(201).json({
    message: "Tenant registered successfully",
    tenantId: tenant._id,
    apiKey: rawApiKey, // ⚠️ show ONLY once
  });
});

// ✅ LOGIN TENANT
exports.loginTenant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const tenant = await Tenant.findOne({ email }).select("+password");

  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  const isMatch = await comparePassword(password, tenant.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: tenant._id,
    role: "tenant",
  });

  res.json({
    message: "Login successful",
    token,
  });
});