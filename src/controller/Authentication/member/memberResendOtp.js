import pendingMember from "../../../model/pendingMember.js";

const memberResendOtp = async (req, res) => {
  try {
    let { primaryPhone } = req.body;

    if (!primaryPhone) {
      return res.status(400).json({
        success: false,
        message: "Primary phone is required",
      });
    }

    primaryPhone = String(primaryPhone).trim();

    // 🔥 latest pending record nikaalo
    const user = await pendingMember
      .findOne({ primaryPhone })
      .sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    // Generate new OTP
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));

    user.otp = newOtp;
    user.otpExpires = Date.now() + 60 * 1000;
    await user.save();

    console.log("New OTP:", newOtp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default memberResendOtp;
