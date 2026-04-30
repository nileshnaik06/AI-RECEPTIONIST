const express = require("express");
const app = express();
const authroutes = require("./Routes/auth.routes");

app.use(express.json());
app.use("/api/auth", authroutes);
module.exports = app;
