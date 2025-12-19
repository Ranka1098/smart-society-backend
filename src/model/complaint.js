import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    buildingCode: {
      type: String,
      required: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    // ⭐ IMPORTANT PART
    unitType: {
      type: String,
      enum: ["Flat", "Shop"],
      required: true,
    },

    unitNo: {
      type: String,
      required: true,
    },

    memberName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const complaintModel = mongoose.model("Complaint", complaintSchema);
export default complaintModel;
