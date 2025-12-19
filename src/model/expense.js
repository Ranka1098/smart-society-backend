import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    billType: {
      type: String,
      required: true,
    },
    billDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    paidTo: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    billProof: {
      type: String,
      required: true,
    },

    // ⭐ MOST IMPORTANT FIELD
    buildingCode: {
      type: String,
      required: true, // ❗required rakho warna forget ho jayega
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
