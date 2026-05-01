const express = require("express");
const app = express();
const routes = require("./Routes/faqs.routes");

app.use(express.json());

// Routes

app.use("/api/faqs",routes);
// app.use('/api/admin/faqs', require('./routes/faqs'));

// Health check
app.get("/", (req, res) => res.json({ status: "API running" }));

module.exports = app;
