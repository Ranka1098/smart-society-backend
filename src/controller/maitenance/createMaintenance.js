import maintenanceModel from "../../model/maintenance.js";
const createMaintenance = async (req, res) => {
  const { month, maintenanceList } = req.body;

  if (!month || maintenanceList.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const formattedData = maintenanceList.map((m) => ({
    // 1. Flat/Shop Number
    No: m.No,

    // 2. Type (flat / shop)
    memberType: m.memberType,

    // 3. Member Name
    memberName: m.memberName,

    // 4. Amount
    amount: m.amount,

    // 5. Baaki fields
    memberId: m.memberId,
    month,
  }));

  // Insert in DB
  try {
    const result = await maintenanceModel.insertMany(formattedData);
    return res.status(201).json({ message: "Maintenance added", data: result });
  } catch (error) {
    return res.status(500).json({ message: "DB Error", error });
  }
};

export default createMaintenance;
