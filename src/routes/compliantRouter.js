import express from "express";
import createComplaint from "../controller/complaints/createComplaint.js";
import verifyMemberToken from "../middleware/verifyMemberToken.js";
import getAdminComplaints from "../controller/complaints/getAdminComplaints.js";
import verfyAdminToken from "../middleware/verifyAdminToken.js";
import resolveComplaint from "../controller/complaints/resolveComplaint.js";
import getMemberComplaint from "../controller/complaints/getMemberComplaint.js";

const complaintRouter = express.Router();

complaintRouter.post(
  "/createComplaint",
  verifyMemberToken, // 🔥 MUST
  createComplaint
);
complaintRouter.get("/getAdminComplaints", verfyAdminToken, getAdminComplaints);
complaintRouter.patch(
  "/resolveComplaint/:id",
  verfyAdminToken,
  resolveComplaint
);
complaintRouter.get(
  "/getMemberComplaint",
  verifyMemberToken,
  getMemberComplaint
);

export default complaintRouter;
