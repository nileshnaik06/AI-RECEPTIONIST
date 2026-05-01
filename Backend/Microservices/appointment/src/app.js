const express = require("express");
const app = express();
const routes = require("./Routes/appointments.route");

app.use(express.json());

// Routes

app.use("/api/appointments",routes);
// app.use('/api/admin/faqs', require('./routes/faqs'));

// Health check
app.get("/", (req, res) => res.json({ status: "API running" }));

module.exports = app;
