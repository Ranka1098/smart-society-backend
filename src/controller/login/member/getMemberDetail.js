import memberModel from "../../../model/member.js";

const getMemberDetail = async (req, res) => {
  try {
    const member = await memberModel
      .findById(req.memberId) // ✔ correct ID from token
      .select("-password -otp"); // ✔ sensitive fields hide

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      message: "Member details fetched successfully",
      member,
    });
  } catch (error) {
    console.error("Get Member Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getMemberDetail;
