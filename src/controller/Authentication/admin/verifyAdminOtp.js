import adminModel from "../../../model/admin.js";

const verifyAdminOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await adminModel.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.isAdmin = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // ✅ Abhi ke liye console me message + buildingCode print karenge
    console.log(
      `🎉 You are registered successfully! Building Code: ${user.buildingCode}`
    );

    res.status(200).json({
      message: "Verification successful",
      buildingCode: user.buildingCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyAdminOtp;
