import jwt from "jsonwebtoken";

const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id; // ✔ correct
    req.buildingCode = decoded.buildingCode; // ⭐ ADD THIS
    next();
  } catch (error) {
    console.error("Token Verify Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyAdminToken;
