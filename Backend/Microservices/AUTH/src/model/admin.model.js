const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, 
    },

    email: {
      type: String,
      required: true,
      uniques: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },

  { timestamps: true },
);

const adminMdoel = mongoose.Model("admin", adminSchema);

module.exports = adminMdoel;
