import dotenv from "dotenv";
dotenv.config();
import adminModel from "../../../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
  try {
    const { role, buildingCode, phone, password } = req.body;

    // Check required fields
    if (!role || !buildingCode || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Role check
    if (role !== "admin") {
      return res.status(403).json({ message: "Invalid role" });
    }

    // Find admin
    const admin = await adminModel.findOne({ phone, buildingCode });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check system owner approval
    if (!admin.isAdmin) {
      return res
        .status(403)
        .json({ message: "Admin access not granted by system owner" });
    }

    // Check verification
    if (!admin.isVerified) {
      return res.status(403).json({ message: "Admin not verified yet" });
    }

    // 🔐 BCRYPT PASSWORD MATCH
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔑 Generate JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        phone: admin.phone,
        buildingCode: admin.buildingCode,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Set httpOnly cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false, // ❗Production me ON rakhna (HTTPS required)
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Admin login successful",
      admin: {
        adminName: admin.adminName,
        phone: admin.phone,
        buildingCode: admin.buildingCode,
        buildingName: admin.bname,
      },
      token, // optional: frontend wants token too?
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminLogin;
