import adminModel from "../../../model/admin.js";

const getAdminDetails = async (req, res) => {
  try {
    const admin = await adminModel
      .findById(req.adminId) // ✔ correct ID
      .select("-password -otp");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getAdminDetails;
