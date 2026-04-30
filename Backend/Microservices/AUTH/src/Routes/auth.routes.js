const express = require("express");
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/auth.controller.js");

const { authenticate } = require("../Middlewares/auth.middleware.js");
const { authorizeRoles } = require("../Middlewares/Role.middleware.js");

const router = express.Router();

// Admin
router.post("/admin/signup", registerAdmin);
router.post("/admin/login", loginAdmin);

// // Tenant
// router.post("/tenant/register", registerTenant);
// router.post("/tenant/login", loginTenant);

// Protected route example
router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  },
);

module.exports = router;
