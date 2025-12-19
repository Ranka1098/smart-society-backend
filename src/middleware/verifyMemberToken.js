import jwt from "jsonwebtoken";
import memberModel from "../model/member.js";

const verifyMemberToken = async (req, res, next) => {
  try {
    const token = req.cookies?.memberToken;

    // 1️⃣ Token check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token found",
      });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Fetch member from DB
    const member = await memberModel.findById(decoded.id);

    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Member not found",
      });
    }

    // 5️⃣ Attach member info to request
    req.memberId = member._id;
    req.buildingCode = member.buildingCode;

    next();
  } catch (error) {
    console.error("Member Token Verify Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired member token",
    });
  }
};

export default verifyMemberToken;
