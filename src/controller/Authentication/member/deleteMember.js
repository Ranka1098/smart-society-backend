import Member from "../../../model/member.js";

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const buildingCode = req.buildingCode; // ✅ from token

    if (!id) {
      return res.status(400).json({
        message: "Member id is required",
      });
    }

    const member = await Member.findOne({
      _id: id,
      buildingCode,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    await Member.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default deleteMember;
