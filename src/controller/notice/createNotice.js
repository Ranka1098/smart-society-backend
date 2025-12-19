import noticeModel from "../../model/notice.js";

const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const buildingCode = req.buildingCode;
    console.log("building code", buildingCode);

    const notice = await noticeModel.create({
      title,
      description,
      buildingCode,
    });

    res.status(201).json({
      success: true,
      notice,
    });
  } catch (error) {
    console.error("Create Notice Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default createNotice;
