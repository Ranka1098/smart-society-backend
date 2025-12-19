import pendingMember from "../../../model/pendingMember.js";

const resendOtp = async (req, res) => {
  try {
    const { pendingId } = req.body;

    // -----------------------------------
    // 1️⃣ PENDING MEMBER CHECK
    // -----------------------------------
    const user = await pendingMember.findById(pendingId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // -----------------------------------
    // 2️⃣ IF ALREADY VERIFIED → BLOCK
    // -----------------------------------
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified.",
      });
    }

    // -----------------------------------
    // 3️⃣ CREATE NEW OTP
    // -----------------------------------
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));

    user.otp = newOtp;
    user.otpExpires = Date.now() + 60 * 1000; // 1 minute ka expiry
    await user.save();

    // ❗Yahan SMS service integrate kar sakte ho (Twilio / Fast2SMS)
    // sendSMS(user.primaryPhone, newOtp)

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otp: newOtp,
    });
  } catch (error) {
    console.log("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export default resendOtp;
