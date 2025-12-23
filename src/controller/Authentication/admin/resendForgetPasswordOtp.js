import adminModel from "../../../model/admin.js";
import memberModel from "../../../model/member.js";

// OTP generator
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const resendForgetPasswordOtp = async (req, res) => {
  try {
    const { role, phone } = req.body;

    if (!role || !phone) {
      return res.status(400).json({ message: "Role and phone required" });
    }

    // 🔁 Dynamic model select
    let user;
    if (role === "admin") {
      user = await adminModel.findOne({ phone });
    } else if (role === "member") {
      user = await memberModel.findOne({ primaryPhone: phone });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate new OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 60 * 1000; // 1 min

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    console.log("RESEND FORGET OTP:", otp);

    // 👉 SMS / Email service here

    res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default resendForgetPasswordOtp;
