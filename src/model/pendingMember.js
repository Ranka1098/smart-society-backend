import mongoose from "mongoose";

const pendingMemberSchema = new mongoose.Schema(
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

    // Phone for OTP
    primaryPhone: { type: String, required: true }, // OTP yahi aayega

    password: { type: String },

    // Family
    memberInFamily: { type: Number, default: 0 },
    men: { type: Number, default: 0 },
    women: { type: Number, default: 0 },
    kids: { type: Number, default: 0 },

    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },

    isVerified: { type: Boolean, default: false },
    isMember: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("PendingMember", pendingMemberSchema);
