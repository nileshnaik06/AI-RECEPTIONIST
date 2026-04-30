// src/models/User.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // always store email in lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries by default
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  },
);

// ─── MIDDLEWARE: Hash password before saving ───────────────────
userSchema.pre("save", async function () {
  // Only hash if password was actually changed
  // If user updates their name — don't re-hash the password
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// ─── METHOD: Compare entered password with stored hash ─────────
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── METHOD: Generate JWT token ────────────────────────────────
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
