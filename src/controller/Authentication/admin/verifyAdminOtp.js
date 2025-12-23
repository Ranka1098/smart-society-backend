import adminModel from "../../../model/admin.js";

const verifyAdminOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const admin = await adminModel.findOne({ phone });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Admin already verified" });
    }

    // 3️⃣ OTP match check (sirf valid time ke andar)
    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 2️⃣ Time check (1 minute ke andar)
    if (Date.now() > admin.otpExpire) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please resend OTP" });
    }

    console.log("OTP EXPIRE:", admin.otpExpire);
    console.log("NOW:", Date.now());

    // ✅ SUCCESS (sirf yahin allowed)
    admin.isVerified = true;
    admin.isAdmin = true;
    admin.otp = null;
    admin.otpExpire = null;

    await admin.save();

    return res.status(200).json({
      message: "Verification successful",
      buildingCode: admin.buildingCode, // 🔥 wahi jo register me bana tha
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyAdminOtp;
