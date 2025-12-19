import express from "express";

import createdStaffMember from "../controller/staff/createdStaffMember.js";
import deleteStaffMember from "../controller/staff/deleteStaffMember.js";
import UpdatedStaffMember from "../controller/staff/UpadatedStaffMember.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import { upload } from "../middleware/multer.js";
import getStaffMember from "../controller/staff/getStaffMember.js";

const staffRouter = express.Router();
staffRouter.post(
  "/createStaffMember",
  verifyAdminToken,
  upload.fields([
    { name: "workerPhoto", maxCount: 1 },
    { name: "workerIdProof", maxCount: 1 },
  ]),
  createdStaffMember
);
staffRouter.get("/allStaffMember", getStaffMember);
staffRouter.patch(
  "updatedStaffmember/:id",
  verifyAdminToken,
  UpdatedStaffMember
);
staffRouter.delete(
  "/deleteStaffMember/:id",
  verifyAdminToken,
  deleteStaffMember
);

export default staffRouter;
