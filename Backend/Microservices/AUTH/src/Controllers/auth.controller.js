// controllers/admin.controller.js
const Admin = require("../model/admin.model.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../Services/auth.service.js");
const { asyncHandler } = require("../utils/asyncHandler.js");

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, adminName, phone } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const hashed = await hashPassword(password);

  const admin = await Admin.create({
    email,
    password: hashed,
    adminName,
    phone,
  });

  res.status(201).json({
    message: "Admin registered",
    id: admin._id,
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({
    id: admin._id,
    role: "admin",
  });

  res.json({ token });
});

module.exports = {
  registerAdmin,
  loginAdmin,
};
