import meetingModel from "../../model/meeting.js";
import memberModel from "../../model/member.js";

const createMeeting = async (req, res) => {
  try {
    const buildingCode = req.buildingCode; // 🔐 middleware se
    const adminId = req.adminId; // 🔐 middleware se

    const { title, discussion, attendance } = req.body;

    // 🔴 Validation
    if (!title || !discussion) {
      return res.status(400).json({
        success: false,
        message: "Title aur discussion required hai",
      });
    }

    if (!attendance || !Array.isArray(attendance)) {
      return res.status(400).json({
        success: false,
        message: "Attendance data invalid hai",
      });
    }

    if (attendance.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Attendance empty hai" });
    }

    // 🔹 Optional: ensure members belong to same building
    const memberIds = attendance.map((a) => a.member);

    const validMembers = await memberModel.find({
      _id: { $in: memberIds },
      buildingCode,
    });

    if (validMembers.length !== memberIds.length) {
      return res.status(400).json({
        success: false,
        message: "Kuch members is building ke nahi hai",
      });
    }

    const meeting = await meetingModel.create({
      title,
      discussion,
      meetingDate: new Date(),
      attendance,
      createdBy: adminId,
      buildingCode, // 🔥 MUST
    });

    res.status(201).json({
      success: true,
      message: "Meeting successfully created",
      meeting,
    });
  } catch (error) {
    console.error("Create Meeting Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export default createMeeting;
