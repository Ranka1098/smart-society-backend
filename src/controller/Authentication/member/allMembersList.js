import memberModel from "../../../model/member.js";

const allMembersList = async (req, res) => {
  try {
    const buildingCode = req.buildingCode;
    console.log("buildingCode", buildingCode);
    const members = await memberModel
      .find({ buildingCode: buildingCode })
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      total: members.length,
      members,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default allMembersList;
