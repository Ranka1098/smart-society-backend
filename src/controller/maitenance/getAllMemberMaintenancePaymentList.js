import maintenanceModel from "../../model/maintenance.js";
import memberModel from "../../model/member.js";

const getAllMemberMaintenancePaymentList = async (req, res) => {
  try {
    const buildingCode = req.buildingCode;
    const { month } = req.query;

    if (!buildingCode || !month) {
      return res.status(400).json({
        success: false,
        message: "Building code or month missing",
      });
    }

    // ✅ All members of building
    const members = await memberModel.find({ buildingCode });

    // ✅ Paid maintenance for this month
    const payments = await maintenanceModel.find({
      buildingCode,
      month,
    });

    // ✅ Map: memberId → payment
    const paymentMap = {};
    payments.forEach((p) => {
      paymentMap[p.memberId.toString()] = p;
    });

    // ✅ Final list (Paid + Pending)
    const finalList = members.map((m) => {
      const payment = paymentMap[m._id.toString()];

      const memberName =
        m.flatOwnerName ||
        m.flatRenterName ||
        m.shopOwnerName ||
        m.shopRenterName ||
        "";

      const unitNo = m.memberType === "Flat" ? m.flatNo : m.shopNo;

      return {
        memberId: m._id,
        memberName,
        memberType: m.memberType,
        No: unitNo,

        // ✅ ADD THESE
        residencyStatus: m.residencyStatus, // Occupied | Vacant
        isActive: m.isActive, // true | false

        amount: payment ? payment.amount : null,
        status: payment ? "Paid" : "Pending",
        paidDate: payment ? payment.paidDate : null,
        paymentMode: payment ? payment.paymentMode : null,
        month,
      };
    });

    return res.status(200).json({
      success: true,
      total: finalList.length,
      data: finalList,
    });
  } catch (error) {
    console.error("Get Maintenance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getAllMemberMaintenancePaymentList;
