import express from "express";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import createMeeting from "../controller/meeting/createMeeting.js";
import allMeetingList from "../controller/meeting/allMeetingList.js";
import singleMeetingDetail from "../controller/meeting/singleMeetingDetail.js";

const meetingRouter = express.Router();

meetingRouter.post("/createMeeting", verifyAdminToken, createMeeting);
meetingRouter.get("/allMeetingList", verifyAdminToken, allMeetingList);
meetingRouter.get(
  "/singleMeeting/:meetingId",
  verifyAdminToken,
  singleMeetingDetail
);

export default meetingRouter;
