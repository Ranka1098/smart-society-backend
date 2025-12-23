import adminModel from "../../../model/admin.js";
import memberModel from "../../../model/member.js";

const forgetPasswordOtp = async (req, res) => {
  const { role, phone, otp } = req.body;

  const model = role === "admin" ? adminModel : memberModel;

  const user = await model.findOne({
    ...(role === "admin" ? { phone } : { primaryPhone: phone }),
    resetOtp: otp,
    resetOtpExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  res.json({ message: "OTP verified" });
};
export default forgetPasswordOtp;
