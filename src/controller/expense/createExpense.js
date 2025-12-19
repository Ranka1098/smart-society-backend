import expenseModel from "../../model/expense.js";
import memberModel from "../../model/member.js";
import notificationModel from "../../model/notification.js";

const createExpense = async (req, res) => {
  try {
    const buildingCode = req.buildingCode; // ⭐ Auto from token

    if (!buildingCode) {
      return res.status(400).json({
        success: false,
        message: "Building code missing from token",
      });
    }

    const { billType, billDate, amount, description, paidTo, paymentMethod } =
      req.body;

    if (!billType || !billDate || !amount || !paidTo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const billProof = req.file ? req.file.path : null;

    // ⭐ Create Expense with buildingCode
    const newExpense = await expenseModel.create({
      billType,
      billDate,
      amount,
      description,
      paidTo,
      paymentMethod,
      buildingCode,
      billProof,
    });

    // ⭐ Find members of same building
    const members = await memberModel.find({ buildingCode });

    const notificationMessage = `New ${billType} bill added: ₹${amount}`;

    // ⭐ Create notifications for each member
    const notifications = members.map((member) => ({
      memberId: member._id,
      message: notificationMessage,
      buildingCode,
    }));

    await notificationModel.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Expense added & notifications sent",
      expense: newExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: error.message,
    });
  }
};

export default createExpense;
