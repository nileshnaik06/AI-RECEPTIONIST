const express = require("express");
const app = express();
const route = require("./Routes/tenants.route");

app.use("/tenant", route);
module.exports = app;
