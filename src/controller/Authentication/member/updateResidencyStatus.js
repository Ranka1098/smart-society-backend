import memberModel from "../../../model/member.js";

const updateResidencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { residencyStatus } = req.body;

    // 🔒 Admin can only mark as Vacant
    if (residencyStatus !== "Vacant") {
      return res.status(400).json({
        message: "Invalid operation. Admin can only mark member as Vacant.",
      });
    }

    const updated = await memberModel.findByIdAndUpdate(
      id,
      {
        residencyStatus: "Vacant",
        isActive: false, // 🔹 member inactive
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member marked as Vacant",
      member: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default updateResidencyStatus;
