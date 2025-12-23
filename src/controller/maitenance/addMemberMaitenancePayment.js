import maintenanceModel from "../../model/maintenance.js";
import memberModel from "../../model/member.js";

const addMemberMaitenancePayment = async (req, res) => {
  try {
    const buildingCode = req.buildingCode;
    const { no, amount, paymentMode, month, paidDate } = req.body;

    if (!no || !amount || !month || !paidDate || !paymentMode) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ find member
    const member = await memberModel.findOne({
      buildingCode,
      $or: [
        { flatNo: no }, // string match
        { shopNo: no }, // string match
        { flatNo: Number(no) }, // number match
        { shopNo: Number(no) }, // number match
      ],
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this building",
      });
    }

    // 🔹 Removed residencyStatus check

    const memberName =
      member.flatOwnerName ||
      member.flatRenterName ||
      member.shopOwnerName ||
      member.shopRenterName ||
      "";

    if (!memberName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Member name missing in member record",
      });
    }

    const alreadyPaid = await maintenanceModel.findOne({
      memberId: member._id,
      buildingCode,
      month,
    });

    if (alreadyPaid) {
      return res.status(400).json({
        success: false,
        message: "Maintenance already paid for this month",
      });
    }

    const type = member.memberType;
    const unitNo = type === "Flat" ? member.flatNo : member.shopNo;

    const payment = await maintenanceModel.create({
      memberId: member._id,
      buildingCode,
      No: unitNo,
      memberName: memberName.trim(),
      Type: type,
      amount: Number(amount),
      status: "Paid",
      paidDate: new Date(paidDate),
      paymentMode,
      month,
    });

    res.status(201).json({
      success: true,
      message: "Maintenance payment added successfully",
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("Maintenance Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default addMemberMaitenancePayment;
