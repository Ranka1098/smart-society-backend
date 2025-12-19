import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    buildingCode: {
      type: String,
      required: true,
    },
    No: {
      type: Number,
      required: true,
    },
    memberName: {
      type: String,
    },
    Type: {
      type: String,
      enum: ["Flat", "Shop"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "Paid"],
      default: "pending",
    },
    paidDate: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Cheque"],
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const maintenanceModel = mongoose.model("Maintenance", maintenanceSchema);
export default maintenanceModel;
