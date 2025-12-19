import PendingMember from "../../../model/pendingMember.js";

const adminRejectMember = async (req, res) => {
  try {
    const { pendingId } = req.body;

    // 🔍 Check pending member
    const pending = await PendingMember.findById(pendingId);
    if (!pending)
      return res.status(404).json({ message: "Pending member not found" });

    // ❌ Delete pending user
    await PendingMember.findByIdAndDelete(pendingId);

    return res.status(200).json({
      success: true,
      message: "Member rejected & removed from pending list",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default adminRejectMember;
