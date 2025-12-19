import pendingMember from "../../../model/pendingMember.js";
import memberModel from "../../../model/member.js";
import bcrypt from "bcrypt";

const flatOwnerRegistration = async (req, res) => {
  try {
    const {
      memberType,
      status,
      buildingCode,
      flatNo,
      flatOwnerName,
      primaryPhone,
      password,
      memberInFamily,
      men,
      women,
      kids,
    } = req.body;

    // 1️⃣ BLOCK IF THIS FLAT IS ALREADY APPROVED
    const occupiedMemberForFlat = await memberModel.findOne({
      buildingCode,
      flatNo,
      residencyStatus: "Occupied",
    });

    if (occupiedMemberForFlat) {
      return res.status(400).json({
        success: false,
        message: `This flat number ${flatNo} is already occupied`,
      });
    }

    // 2️⃣ BLOCK IF PRIMARY PHONE USED BY VERIFIED MEMBER
    const phoneInUse = await memberModel.findOne({
      buildingCode,
      primaryPhone,
    });

    if (phoneInUse) {
      return res.status(400).json({
        success: false,
        message: `This phone number is already used. Use a different number`,
      });
    }

    const pendingPhoneUsed = await pendingMember.findOne({
      buildingCode,
      primaryPhone,
      isVerified: true,
    });
    if (pendingPhoneUsed) {
      return res.status(400).json({
        success: false,
        message: `This phone number is already used. Use a different number`,
      });
    }

    // 3️⃣ CHECK IF USER IS VERIFIED BUT WAITING FOR ADMIN APPROVAL
    const verifiedButPending = await pendingMember.findOne({
      buildingCode,
      flatNo,
      isVerified: true,
      isMember: false,
    });

    if (verifiedButPending) {
      return res.status(400).json({
        success: false,
        message:
          "You have already verified your OTP. Please wait for admin approval.",
      });
    }

    // 4️⃣ CHECK IF ALREADY PENDING (NOT VERIFIED) → RESEND OTP
    const existingPending = await pendingMember.findOne({
      buildingCode,
      flatNo,
      primaryPhone,
      isVerified: false,
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    if (existingPending) {
      existingPending.otp = otp;
      existingPending.otpExpires = Date.now() + 60 * 1000;
      await existingPending.save();

      console.log("OTP Resent:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        pendingId: existingPending._id,
      });
    }

    // 5️⃣ CREATE NEW MEMBER (FIRST TIME REGISTRATION)
    const hashedPassword = await bcrypt.hash(password, 10);

    const pending = await pendingMember.create({
      memberType,
      status,
      buildingCode,
      flatNo,
      flatOwnerName,
      primaryPhone,
      password: hashedPassword,
      memberInFamily,
      men,
      women,
      kids,
      otp,
      otpExpires: Date.now() + 60 * 1000,
      isVerified: false,
      isMember: false,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      pendingId: pending._id,
    });
  } catch (error) {
    console.log("Flat Owner Registration Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default flatOwnerRegistration;
