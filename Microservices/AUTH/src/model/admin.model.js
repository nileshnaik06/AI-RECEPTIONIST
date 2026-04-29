const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { createdAt: Date.now() },
);

const adminModel = mongoose.Model("admin", adminSchema);

module.exports = adminModel;
