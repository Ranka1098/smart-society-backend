import maintenanceModel from "../../../model/maintenance.js";
import memberModel from "../../../model/member.js";

const addMaintenance = async (req, res) => {
  try {
    const buildingCode = req.buildingCode;

    const { no, amount, paymentMode, month, paidDate } = req.body;

    const member = await memberModel.findOne({
      buildingCode,
      No: no,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // 🟢 MEMBER SE DETAILS NIKAL LO
    const memberName = member.name;

    // Shop ya flat decide karne ke liye
    let flatType = "";
    if (memberType.includes("Flat")) flatType = "Flat";
    if (memberType.includes("Shop")) flatType = "Shop";

    // 🔥 New Maintenance Entry
    const newPayment = new maintenanceModel({
      memberId: member._id,
      buildingCode,
      No: no,
      memberName,
      flatType,
      amount,
      status: "Paid",
      paidDate: paidDate || new Date(),
      paymentMode,
      month,
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Maintenance payment recorded",
      payment: newPayment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default addMaintenance;
