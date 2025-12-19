import PendingMember from "../../../model/pendingMember.js";
import memberModel from "../../../model/member.js";
import bcrypt from "bcrypt";

const shopOwnerRegistration = async (req, res) => {
  try {
    const {
      memberType, // "Shop"
      status, // "Owner"
      buildingCode,
      shopNo,
      shopOwnerName,
      primaryPhone,
      password,
    } = req.body;

    //---------------------------------------------------
    // 1️⃣ CHECK IF THIS SHOP IS ALREADY APPROVED MEMBER
    //---------------------------------------------------
    const existingShop = await memberModel.findOne({
      buildingCode,
      shopNo,
    });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: `This shop number ${shopNo} is already registered.`,
      });
    }

    //---------------------------------------------------
    // 2️⃣ CHECK IF PRIMARY PHONE IS ALREADY USED BY APPROVED MEMBER
    //---------------------------------------------------
    const phoneInUse = await memberModel.findOne({
      buildingCode,
      primaryPhone,
    });

    if (phoneInUse) {
      return res.status(400).json({
        success: false,
        message: "This phone number is already used. Use a different number.",
      });
    }

    const pendingPhoneUsed = await PendingMember.findOne({
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

    //---------------------------------------------------
    // 3️⃣ CHECK IF USER IS VERIFIED BUT WAITING FOR ADMIN APPROVAL
    //---------------------------------------------------
    const verifiedButPending = await PendingMember.findOne({
      buildingCode,
      shopNo,
      primaryPhone,
      isVerified: true,
      isMember: false, // admin approval pending
    });

    if (verifiedButPending) {
      return res.status(400).json({
        success: false,
        message:
          "Your OTP is already verified. Please wait for admin approval.",
      });
    }

    //---------------------------------------------------
    // 4️⃣ CHECK IF ANY PENDING RECORD EXISTS → RESEND OTP
    //---------------------------------------------------
    let pending = await PendingMember.findOne({
      buildingCode,
      primaryPhone,
      isVerified: false,
    });

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    if (pending && !pending.isVerified) {
      pending.otp = otp;
      pending.otpExpires = Date.now() + 60 * 1000;
      await pending.save();

      console.log("Shop Owner OTP Resent:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        pendingId: pending._id,
      });
    }

    //---------------------------------------------------
    // 5️⃣ HASH PASSWORD
    //---------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    //---------------------------------------------------
    // 6️⃣ CREATE NEW PENDING SHOP OWNER RECORD
    //---------------------------------------------------
    pending = await PendingMember.create({
      memberType,
      status,
      buildingCode,
      shopNo,
      shopOwnerName,
      primaryPhone,
      password: hashedPassword,

      otp,
      otpExpires: Date.now() + 60 * 1000,

      isVerified: false,
      isMember: false,
      approvalStatus: "Pending",
    });

    console.log(`Shop Owner OTP sent for ${primaryPhone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      pendingId: pending._id,
    });
  } catch (error) {
    console.log("Shop Owner Registration Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default shopOwnerRegistration;
