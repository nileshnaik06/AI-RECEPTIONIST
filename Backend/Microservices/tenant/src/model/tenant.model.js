const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  },
  open: { type: String, default: "9am" },
  close: { type: String, default: "5pm" },
  isClosed: { type: Boolean, default: false },
});

const tenantSchema = new mongoose.Schema(
  {
    docName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    apiKey: {
      type: String,
      required: true,
      unique: true,
      select: false, //
    },

    details: {
      clinicName: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
      },

      password: {
        type: String,
        required: true,
        select: false,
      },

      workingHrs: [workingHoursSchema],

      services: [
        {
          type: String,
          enum: [
            "Emergency",
            "OPD",
            "IPD",
            "Surgery",
            "Cardiology",
            "Neurology",
            "Orthopedics",
            "Pediatrics",
            "Gynecology",
            "Radiology",
            "Laboratory",
            "Pharmacy",
            "Physiotherapy",
            "Dentistry",
            "ENT",
            "Dermatology",
            "Psychiatry",
            "Oncology",
            "Nephrology",
            "Gastroenterology",
            "Urology",
            "Ophthalmology",
            "Pathology",
            "Rehabilitation",
            "Vaccination",
          ],
        },
      ],

      welcomeMsg: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const tenantModel = mongoose.model("Tenant", tenantSchema);

module.exports = tenantModel;
