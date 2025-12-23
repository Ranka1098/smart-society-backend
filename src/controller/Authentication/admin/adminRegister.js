import adminModel from "../../../model/admin.js";
import bcrypt from "bcrypt";

// ---------------------------------------------------------
// Generate Unique Building Code
// ---------------------------------------------------------
const generateBuildingCode = async () => {
  let buildingCode;
  let exists = true;

  while (exists) {
    buildingCode = `BLD-${Math.floor(100000 + Math.random() * 900000)}`;
    exists = await adminModel.findOne({ buildingCode });
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

    const existingUser = await adminModel.findOne({ phone });

    // ✅ If already verified → block
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const otp = generateOtp();

    // ✅ New admin
    if (!existingUser) {
      const buildingCode = await generateBuildingCode();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new adminModel({
        adminName,
        phone,
        bname,
        address,
        pincode,
        password: hashedPassword,
        buildingCode,
        otp,
        otpExpire: Date.now() + 60 * 1000,
        isVerified: false,
        isAdmin: false,
      });
      console.log("otp expiry time", Date.now() + 60 * 1000);
      console.log("REGISTER API HIT");

      await newAdmin.save();
    }
    // ✅ Existing but NOT verified → resend OTP
    else {
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminRegister;
