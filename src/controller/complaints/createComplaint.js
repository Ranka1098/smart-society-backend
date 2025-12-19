import complaintModel from "../../model/complaint.js";
const createComplaint = async (req, res) => {
  try {
    const { unitType, unitNo, memberName, category, description } = req.body;
    const buildingCode = req.buildingCode;
    const memberId = req.memberId;

    if (!buildingCode || !memberId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!unitType || !unitNo || !memberName || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["Flat", "Shop"].includes(unitType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid unit type",
      });
    }

    const complaint = await complaintModel.create({
      buildingCode,
      memberId,
      unitType,
      unitNo,
      memberName,
      category,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint raised successfully",
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

export default createComplaint;
