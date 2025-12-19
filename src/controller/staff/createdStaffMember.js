import StaffModel from "../../model/staff.js";
const createdStaffMember = async (req, res) => {
  try {
    const buildingCode = req.buildingCode;

    const { role, workerName, joiningDate, workerPhoneNumber, workerAddress } =
      req.body;

    const workerPhoto = req.files?.workerPhoto
      ? req.files.workerPhoto[0].path
      : null;

    const workerIdProof = req.files?.workerIdProof
      ? req.files.workerIdProof[0].path
      : null;

    const newStaff = new StaffModel({
      buildingCode,
      role,
      workerName,
      joiningDate,
      workerPhoneNumber,
      workerAddress,
      workerPhoto, // ✅ path save hoga
      workerIdProof, // ✅ path save hoga
    });

    await newStaff.save();

    res.status(201).json({
      message: "Staff member created successfully",
      staff: newStaff,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default createdStaffMember;
