import adminModel from "../../../model/admin.js";
import pendingModel from "../../../model/pendingMember.js";

const verifyMemberOtp = async (req, res) => {
  try {
    let { primaryPhone, otp } = req.body;

    if (!primaryPhone || !otp) {
      return res.status(400).json({ message: "primaryPhone and otp required" });
    }

    primaryPhone = String(primaryPhone).trim();
    otp = String(otp).trim();

    // Fix: Correct way to get latest pending entry.
    const pendingList = await pendingModel
      .find({ primaryPhone })
      .sort({ createdAt: -1 })
      .limit(1);

    const pending = pendingList[0];

    if (!pending) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already verified
    if (pending.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Already verified. Waiting for admin approval.",
      });
    }

    // OTP expiry check
    const expires = Number(pending.otpExpires);
    if (expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP match
    if (String(pending.otp).trim() !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP VERIFIED SUCCESS
    pending.isVerified = true;
    await pending.save();

    // ---------------------------
    const admin = await adminModel.findOne({
      buildingCode: pending.buildingCode,
    });

    if (pending.isVerified) {
      if (admin) {
        // Console print for debugging
        console.log(
          `Admin Alert: Member (${
            pending.flatNo || pending.shopNo
          }) of building ${
            pending.buildingCode
          } has verified OTP and is waiting for approval.`
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Waiting for admin approval.",
      pendingId: pending._id,
      memberType: pending.memberType,
      status: pending.status,
    });
  } catch (error) {
    console.error("verifyMemberOtp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default verifyMemberOtp;
