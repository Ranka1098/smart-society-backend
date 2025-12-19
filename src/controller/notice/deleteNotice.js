import noticeModel from "../../model/notice.js";

export const deleteNotice = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { id } = req.params;

    await noticeModel.findByIdAndUpdate(id, { isActive: false });

    res.json({ success: true, message: "Notice removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
