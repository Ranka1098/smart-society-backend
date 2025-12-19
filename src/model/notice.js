import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    buildingCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin"],
      default: "Admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const noticeModel = mongoose.model("Notice", noticeSchema);
export default noticeModel;
