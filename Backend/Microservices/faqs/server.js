require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./src/app");
const CONNECTTODB = require("./src/db/db");

// Middleware
app.use(cors({ origin: "*" }));

// DB Connection
CONNECTTODB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
