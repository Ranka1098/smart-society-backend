import complaintModel from "../../model/complaint.js";
const getAdminComplaints = async (req, res) => {
  const buildingCode = req.buildingCode;

  const complaints = await complaintModel.find({ buildingCode });

  res.status(200).json({
    success: true,
    complaints,
  });
};

export default getAdminComplaints;
