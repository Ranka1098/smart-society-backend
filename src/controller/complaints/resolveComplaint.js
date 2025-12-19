import complaintModel from "../../model/complaint.js";

const resolveComplaint = async (req, res) => {
  try {
    const buildingCode = req.buildingCode; // admin ke token se
    const adminId = req.adminId; // optional but best
    const complaintId = req.params.id;

    // 🔒 Step 1: complaint check (same society?)
    const complaint = await complaintModel.findOne({
      _id: complaintId,
      buildingCode: buildingCode, // 🔥 same society only
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found for this society",
      });
    }

    // 🔁 Step 2: already resolved?
    if (complaint.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Complaint already resolved",
      });
    }

    // ✅ Step 3: resolve complaint
    complaint.status = "resolved";
    complaint.resolvedBy = adminId;
    complaint.resolvedAt = new Date();

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default resolveComplaint;
