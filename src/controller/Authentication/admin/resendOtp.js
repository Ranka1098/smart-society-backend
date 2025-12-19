import adminModel from "../../../model/admin.js";

// OTP generator
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Example: function to send OTP on phone (Twilio / Fast2SMS / MSG91 etc.)
const sendOtpOnPhone = async (phone, otp) => {
  // ✅ Yaha aap SMS API integrate karoge
  // For now console me print kar raha hu
  console.log(`OTP sent to ${phone}: ${otp}`);
};

const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    // user ko dhoondo
    const user = await adminModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // agar pehla OTP abhi tak expire nahi hua hai
    if (user.otpExpire && user.otpExpire > Date.now()) {
      return res
        .status(400)
        .json({ message: "Please wait, current OTP is still valid" });
    }

    // naya OTP generate karo
    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpire = Date.now() + 60 * 1000; // 1 min expiry
    await user.save();

    // phone par bhejo
    await sendOtpOnPhone(phone, newOtp);

    res.status(200).json({ message: "New OTP sent to your phone" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

export default resendOtp;
