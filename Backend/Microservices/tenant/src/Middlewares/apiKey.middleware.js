// middleware/apiKey.middleware.js
const crypto = require("crypto");
const Tenant = require("../model/tenant.model");

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

exports.verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  const hashedKey = hashApiKey(apiKey);

  const tenant = await Tenant.findOne({ apiKey: hashedKey });

  if (!tenant) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  req.tenant = tenant;
  next();
};