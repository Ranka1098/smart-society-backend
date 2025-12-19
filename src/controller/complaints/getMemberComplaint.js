import complaintModel from "../../model/complaint.js";

const getMemberComplaint = async (req, res) => {
  try {
    const memberId = req.memberId;
    const buildingCode = req.buildingCode;

    const complaints = await complaintModel
      .find({ memberId, buildingCode })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getMemberComplaint;
