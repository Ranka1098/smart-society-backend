import PendingMember from "../../../model/pendingMember.js";
import memberModel from "../../../model/member.js";
import bcrypt from "bcrypt";

const shopRentRegistration = async (req, res) => {
  try {
    const {
      memberType,
      status,
      buildingCode,
      shopNo,
      shopOwnerName,
      shopOwnerPhoneNumber,
      shopRenterName,
      primaryPhone,
      dateOfJoiningShop,
      password,
    } = req.body;

    //---------------------------------------------------
    // 1️⃣ CHECK IF SHOP IS ALREADY APPROVED MEMBER
    //---------------------------------------------------
    const existingShop = await memberModel.findOne({ buildingCode, shopNo });

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

    //---------------------------------------------------
    // ❗ NEW IMPORTANT FIX:
    // 3️⃣ CHECK IF ANY VERIFIED PENDING MEMBER EXISTS FOR SAME SHOP — BLOCK!
    //---------------------------------------------------
    const pendingVerifiedForShop = await PendingMember.findOne({
      buildingCode,
      shopNo,
      isVerified: true,
      isMember: false, // admin approval still pending
    });

    if (pendingVerifiedForShop) {
      return res.status(400).json({
        success: false,
        message:
          "This shop is already verified by another user. Please wait for admin approval.",
      });
    }

    //---------------------------------------------------
    // 4️⃣ CHECK IF SAME USER ALREADY VERIFIED BUT AWAITING ADMIN APPROVAL
    //---------------------------------------------------
    const verifiedButPending = await PendingMember.findOne({
      buildingCode,
      shopNo,
      primaryPhone,
      isVerified: true,
      isMember: false,
    });

    if (verifiedButPending) {
      return res.status(400).json({
        success: false,
        message:
          "Your OTP is already verified. Please wait for admin approval.",
      });
    }

    //---------------------------------------------------
    // 5️⃣ CHECK IF SAME USER HAS A NON-VERIFIED PENDING → RESEND OTP
    //---------------------------------------------------
    let pending = await PendingMember.findOne({
      buildingCode,
      shopNo,
      primaryPhone,
      isVerified: false,
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    if (pending && !pending.isVerified) {
      pending.otp = otp;
      pending.otpExpires = Date.now() + 60 * 1000;
      await pending.save();

      console.log("Shop Renter OTP Resent:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        pendingId: pending._id,
      });
    }

    //---------------------------------------------------
    // 6️⃣ HASH PASSWORD
    //---------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    //---------------------------------------------------
    // 7️⃣ CREATE NEW PENDING ENTRY
    //---------------------------------------------------
    pending = await PendingMember.create({
      memberType,
      status,
      buildingCode,
      shopNo,
      shopOwnerName,
      shopOwnerPhoneNumber,
      shopRenterName,
      primaryPhone,
      dateOfJoiningShop,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 60 * 1000,
      isVerified: false,
      isMember: false,
      approvalStatus: "Pending",
    });

    console.log(`Shop Renter OTP sent for ${primaryPhone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      pendingId: pending._id,
    });
  } catch (error) {
    console.log("Shop Renter Registration Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default shopRentRegistration;
