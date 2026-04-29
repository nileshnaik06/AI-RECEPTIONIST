const express = require("express");
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/auth.controller.js");

const { authenticate } = require("../middleware/auth.middleware.js");
const { authorizeRoles } = require("../middleware/role.middleware.js");

const router = express.Router();

// Admin
router.post("/api/admin/register", registerAdmin);
router.post("/api/admin/login", loginAdmin);

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

export default router;
