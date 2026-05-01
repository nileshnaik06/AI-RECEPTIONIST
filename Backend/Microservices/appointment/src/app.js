const express = require("express");
const cors    = require("cors");
const appointmentRoutes = require("./Routes/appointments.route");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => res.json({ status: "Appointment Service running 🚀" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;