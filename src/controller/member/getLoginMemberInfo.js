import memberModel from "../../model/member.js";

const getLoginMemberInfo = async (req, res) => {
  try {
    const memberId = req.memberId; // ✅ token se aaya

    if (!memberId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const member = await memberModel
      .findById(memberId)
      .select("-password -otp"); // sensitive data hide

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("getLoginMemberInfo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getLoginMemberInfo;
