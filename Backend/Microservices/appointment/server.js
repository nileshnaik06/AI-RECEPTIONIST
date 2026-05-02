require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./src/app");
const connectDB = require("./src/db/db");

// Middleware
app.use(cors({ origin: "*" }));

// DB Connection
connectDB();
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
