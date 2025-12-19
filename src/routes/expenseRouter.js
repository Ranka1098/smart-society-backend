import express from "express";
import createExpense from "../controller/expense/createExpense.js";
import getExpense from "../controller/expense/getExpense.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import { upload } from "../middleware/multer.js";

const expenseRouter = express.Router();

expenseRouter.post(
  "/createExpense",
  verifyAdminToken,
  upload.single("billProof"),
  createExpense
);
expenseRouter.get("/getExpense", verifyAdminToken, getExpense);

export default expenseRouter;
