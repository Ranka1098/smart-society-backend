import memberModel from "../../../model/member.js";
import PendingMember from "../../../model/pendingMember.js";
import bcrypt from "bcrypt";

const flatRentRegistration = async (req, res) => {
  try {
    const {
      memberType, // Flat
      status, // Rent
      buildingCode,
      flatNo,
      flatOwnerName,
      flatOwnerPhoneNumber,
      flatRenterName,
      primaryPhone,
      dateOfJoiningFlat,
      password,
      memberInFamily,
      men,
      women,
      kids,
    } = req.body;

    //----------------------------------------
    // 1️⃣ BLOCK IF THIS FLAT IS ALREADY APPROVED (Owner or Rent)
    //----------------------------------------
    const alreadyApproved = await memberModel.findOne({
      buildingCode,
      flatNo,
    });

    if (alreadyApproved) {
      return res.status(400).json({
        success: false,
        message: `This flat number ${flatNo} is already registered in society.`,
      });
    }

    //----------------------------------------
    // 2️⃣ BLOCK IF PRIMARY PHONE ALREADY USED BY APPROVED MEMBER
    //----------------------------------------
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

    //----------------------------------------
    // 3️⃣ BLOCK IF USER IS VERIFIED BUT WAITING FOR ADMIN APPROVAL
    //----------------------------------------
    const verifiedButPending = await PendingMember.findOne({
      buildingCode,
      flatNo,
      primaryPhone,
      isVerified: true,
      isMember: false, // admin approval pending
    });

    if (verifiedButPending) {
      return res.status(400).json({
        success: false,
        message:
          "You have already verified OTP. Please wait for admin approval.",
      });
    }

    //----------------------------------------
    // 4️⃣ CHECK IF ANY PENDING REGISTRATION EXISTS → OTP RESEND
    //----------------------------------------
    let pending = await PendingMember.findOne({
      buildingCode,
      flatNo,
      primaryPhone,
      isVerified: false,
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    if (pending && !pending.isVerified) {
      pending.otp = otp;
      pending.otpExpires = Date.now() + 60 * 1000;
      await pending.save();

      console.log("OTP Resent:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        pendingId: pending._id,
      });
    }

    //----------------------------------------
    // 5️⃣ HASH PASSWORD
    //----------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    //----------------------------------------
    // 6️⃣ CREATE NEW RENT PENDING MEMBER
    //----------------------------------------
    pending = await PendingMember.create({
      memberType,
      status,
      buildingCode,
      flatNo,
      flatOwnerName,
      flatOwnerPhoneNumber,
      flatRenterName,

      primaryPhone,
      password: hashedPassword,
      dateOfJoiningFlat,

      memberInFamily,
      men,
      women,
      kids,

      otp,
      otpExpires: Date.now() + 60 * 1000,
      isVerified: false,
      isMember: false,
      approvalStatus: "Pending",
    });

    console.log(`OTP sent for Renter ${primaryPhone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      pendingId: pending._id,
    });
  } catch (error) {
    console.log("Flat Rent Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default flatRentRegistration;
