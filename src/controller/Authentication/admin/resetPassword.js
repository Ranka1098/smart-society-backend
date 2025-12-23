import bcrypt from "bcrypt";
import adminModel from "../../../model/admin.js";
import memberModel from "../../../model/member.js";

const resetPassword = async (req, res) => {
  try {
    const { role, phone, newPassword, confirmPassword } = req.body;

    // 1️⃣ Validation
    if (!role || !phone || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2️⃣ Model select
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

    // 3️⃣ Password hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password
    user.password = hashedPassword;

    // 🔐 Clear OTP data (important)
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default resetPassword;
