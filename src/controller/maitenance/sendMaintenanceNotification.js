import NotificationModel from "../../model/notification.js";
const sendMaintenanceNotification = async (req, res) => {
  try {
    const { month, members } = req.body;

    const notifications = members.map((m) => ({
      memberId: m.id,
      message: `${month} ka ₹${m.amount} maintenance amount pay karna hai.`,
    }));

    await NotificationModel.insertMany(notifications);

    res.json({ success: true, message: "Notifications sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default sendMaintenanceNotification;
