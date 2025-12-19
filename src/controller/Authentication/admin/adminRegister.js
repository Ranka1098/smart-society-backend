import adminModel from "../../../model/admin.js";
import bcrypt from "bcrypt";

// ---------------------------------------------------------
// Generate Unique Building Code
// ---------------------------------------------------------
const generateBuildingCode = async () => {
  let isUnique = false;
  let buildingCode;

  while (!isUnique) {
    buildingCode = `BLD-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await adminModel.findOne({ buildingCode });
    if (!existing) isUnique = true;
  }

  return buildingCode;
};

// ---------------------------------------------------------
// Generate OTP
// ---------------------------------------------------------
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---------------------------------------------------------
// Admin Register Controller
// ---------------------------------------------------------
const adminRegister = async (req, res) => {
  try {
    const { adminName, phone, bname, address, pincode, password } = req.body;

    // Check existing admin by phone
    let existingUser = await adminModel.findOne({ phone });

    // Agar user verified hai → dobara register nahi kar sakta
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Phone already registered" });
    }
    const buildingCode = await generateBuildingCode();

    // Generate OTP
    const otp = generateOtp();

    // New user case
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new adminModel({
        adminName,
        phone,
        bname,
        address,
        pincode,
        password: hashedPassword, // ✔ HASHED PASSWORD
        buildingCode,
        otp,
        otpExpire: Date.now() + 60 * 1000, // 1 minute
        isVerified: false,
        isAdmin: false,
      });

      await newAdmin.save();
    } else {
      // User exists but not verified → Resend OTP + Update Password
      existingUser.otp = otp;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otpExpire = Date.now() + 60 * 1000;
      await existingUser.save();
    }

    console.log(`OTP for ${phone}: ${otp}`);

    res.status(201).json({
      message: "OTP sent to your phone. Please verify.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminRegister;
