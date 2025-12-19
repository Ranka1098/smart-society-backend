import StaffModel from "../../model/staff.js";

const UpdatedStaffMember = async (req, res) => {
  try {
    const { id } = req.params;
    const buildingCode = req.buildingCode; // token se aaya

    // 🟩 Allowed fields
    const allowedFields = [
      "role",
      "workerName",
      "joiningDate",
      "workerPhoneNumber",
      "workerAddress",
      "workerPhoto",
      "workerIdProof",
    ];

    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields sent for update" });
    }

    // 🟥 Staff exist check + buildingCode check
    const staff = await StaffModel.findOne({ _id: id, buildingCode });
    if (!staff) {
      return res
        .status(404)
        .json({ message: "Staff member not found for your building" });
    }

    // 🟩 Safe update
    const updatedStaff = await StaffModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Staff updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default UpdatedStaffMember;
