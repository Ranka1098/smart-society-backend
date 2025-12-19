import StaffModel from "../../model/staff.js";

const getStaffMember = async (req, res) => {
  try {
    // 🔹 Sabhi staff members fetch kar rahe hain
    const staff = await StaffModel.find({});

    // 🔹 Agar staff exist nahi karta
    if (!staff || staff.length === 0) {
      return res.status(404).json({ message: "No staff members found" });
    }

    // 🔹 Staff data send kar rahe hain
    res.status(200).json({
      message: "Staff members fetched successfully",
      staff,
    });
  } catch (error) {
    console.error("Error fetching staff members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getStaffMember;
