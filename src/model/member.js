import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberType: {
      type: String,
      enum: ["Flat", "Shop"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Owner", "Rent"],
      required: true,
    },

    // Common Fields
    primaryPhone: { type: String, required: true }, // OTP yahin aayega
    password: { type: String },
    buildingCode: { type: String, required: true },

    // Flat Fields
    flatNo: { type: String, default: undefined },
    flatOwnerName: { type: String, default: undefined },
    flatOwnerPhoneNumber: { type: String, default: undefined }, // ADD
    flatRenterName: { type: String, default: undefined },
    dateOfJoiningFlat: { type: Date, default: undefined },

    // Shop Fields
    shopNo: { type: String, default: undefined },
    shopOwnerName: { type: String, default: undefined },
    shopOwnerPhoneNumber: { type: String, default: undefined }, // ADD
    shopRenterName: { type: String, default: undefined },
    dateOfJoiningShop: { type: Date, default: undefined },

    // Family Members
    memberInFamily: { type: Number, default: 0 },
    men: { type: Number, default: 0 },
    women: { type: Number, default: 0 },
    kids: { type: Number, default: 0 },

    // OTP & Verification
    otp: { type: String, default: undefined },
    otpExpires: { type: Date, default: undefined },
    isVerified: { type: Boolean, default: false },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    isMember: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const memberModel = mongoose.model("Member", memberSchema);

export default memberModel;
