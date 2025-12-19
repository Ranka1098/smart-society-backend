import PendingMember from "../../../model/pendingMember.js";

const allPendingRequest = async (req, res) => {
  try {
    const allPendingRequestList = await PendingMember.find({
      isVerified: true, // sirf OTP verify wale hi milenge
    });

    return res.status(200).json({
      success: true,
      total: allPendingRequestList.length,
      data: allPendingRequestList,
    });
  } catch (error) {
    console.error("allPendingRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default allPendingRequest;
