import NotificationModel from "../../../model/notification.js";

const getNotification = async (req, res) => {
  try {
    const { memberId } = req.params;

    const notification = await NotificationModel.find({ memberId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot fetch notifications",
    });
  }
};
