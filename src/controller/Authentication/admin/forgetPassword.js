import adminModel from "../../../model/admin.js";
import memberModel from "../../../model/member.js";

// OTP generator
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const forgetPassword = async (req, res) => {
  try {
    const { role, phone, buildingCode } = req.body;

    // 1️⃣ Validation
    if (!role || !phone || !buildingCode) {
      return res
        .status(400)
        .json({ message: "Role, phone & building code required" });
    }

    // 2️⃣ Dynamic model + exact user find
    let user;
    if (role === "admin") {
      user = await adminModel.findOne({
        phone,
        buildingCode,
      });
    } else if (role === "member") {
      user = await memberModel.findOne({
        primaryPhone: phone,
        buildingCode,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ OTP logic
    const otp = generateOtp();
    const otpExpiry = Date.now() + 60 * 1000; // 1 minute

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    console.log("FORGET PASSWORD OTP:", otp);

    // 👉 SMS / Email service here

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default forgetPassword;
