import dotenv from "dotenv";
dotenv.config();
import memberModel from "../../../model/member.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const memberLogin = async (req, res) => {
  try {
    const { role, buildingCode, primaryPhone, password } = req.body;

    // 1️⃣ Validate request fields
    if (!role || !buildingCode || !primaryPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role !== "member") {
      return res.status(403).json({ message: "Invalid role" });
    }

    // 2️⃣ Find member
    const member = await memberModel.findOne({ primaryPhone, buildingCode });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 3️⃣ Member approval check
    if (!member.isMember) {
      return res.status(403).json({
        message: "Member access not granted by admin",
      });
    }

    // 🔹 Removed residencyStatus inactive/vacant check

    // 4️⃣ Password check
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 5️⃣ Create JWT
    const token = jwt.sign(
      {
        id: member._id,
        primaryPhone: member.primaryPhone,
        buildingCode: member.buildingCode,
        role: "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set httpOnly Cookie
    res.cookie("memberToken", token, {
      httpOnly: true,
      secure: false, // production => true
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7️⃣ Prepare unified name
    const memberName =
      member.flatOwnerName ||
      member.flatRenterName ||
      member.shopOwnerName ||
      member.shopRenterName ||
      "Member";

    return res.status(200).json({
      message: "Member login successful",
      member: {
        status: member.status,
        flatNumber: member.flatNo,
        name: memberName,
        primaryPhone: member.primaryPhone,
        buildingCode: member.buildingCode,
      },
      token,
    });
  } catch (error) {
    console.error("Member Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default memberLogin;
