const mongoose = require("mongoose");

const tenantSchema = mongoose.Schema({
  docName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  details: {
    clinicName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    workingHrs: {
      mon: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
      Tue: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
      Wed: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
      Thur: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
      Fri: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
      Sat: {
        type: String,
        enum: ["9:00AM - 5:00 PM", "10:00AM - 7:00 PM", "10:00AM - 10:00 PM"],
        required: true,
        default: "9:00AM - 5:00 PM",
      },
    },
    Services: {
      type: String,
      enum: [
        "Support Services",
        "Preventive Care & Diagnostics",
        "orthopedics",
        "diagnostic labs",
        "pharmacy services",
        "Specialized treatments in cardiology",
        "obstetrics",
        "Obstetrics and Gynecology",
        "Emergency & Critical Care",
        "Surgical Care",
        "others",
      ],
      default: "Support Services",
    },
    welcomeMessage: "Hi! How can I help you today?",
  },
});

const tenantModel = mongoose.Model("tenant", tenantSchema);

module.exports = tenantModel;
