import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    buildingCode: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    workerName: {
      type: String,
      required: true,
      trim: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    workerPhoneNumber: {
      type: String,
      required: true,
    },

    workerAddress: {
      type: String,
      required: true,
    },

    workerPhoto: {
      type: String, // Cloudinary / server URL
      required: true,
    },

    workerIdProof: {
      type: String, // Cloudinary / server URL
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically
  }
);

const StaffModel = mongoose.model("Staff", staffSchema);

export default StaffModel;
