import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true, // admin ka naam zaroori
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true, // ek phone number se ek hi admin ho
      match: [/^[0-9]{10}$/, "Please enter a valid 10 digit phone number"],
    },
    bname: {
      type: String,
      required: true, // building/society name
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Please enter a valid 6 digit pincode"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // password ki minimum length
    },
    buildingCode: {
      type: String,
      unique: true,
    }, // special code
    otp: String,
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
); // createdAt & updatedAt automatically add hoga

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
