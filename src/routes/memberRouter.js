import express from "express";
import flatOwnerRegistration from "../controller/Authentication/member/flatOwnerRegistration.js";
import flatRentRegistration from "../controller/Authentication/member/flatRentRegistration.js";
import shopOwnerRegistration from "../controller/Authentication/member/shopOwnerRegistration.js";
import shopRentRegistration from "../controller/Authentication/member/shopRentRegistration.js";
import verifyMemberOtp from "../controller/Authentication/member/verifyMemberOtp.js";
import adminApproveMember from "../controller/Authentication/admin/adminApproveMember.js";
import memberLogin from "../controller/login/member/memberLogin.js";
import verifyMemberToken from "../middleware/verifyMemberToken.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import getMemberDetail from "../controller/login/member/getMemberDetail.js";
import memberLogout from "../controller/Authentication/member/memberLogout.js";
import allMembersList from "../controller/Authentication/member/allMembersList.js";
import updateResidencyStatus from "../controller/Authentication/member/updateResidencyStatus.js";
import getLoginMemberInfo from "../controller/member/getLoginMemberInfo.js";
import singleMemberMaintenanceDetail from "../controller/member/SingleMemberMaitenanceDetail.js";
import memberResendOtp from "../controller/Authentication/member/memberResendOtp.js";
const memberRouter = express.Router();

memberRouter.post("/flatOwnerRegister", flatOwnerRegistration);
memberRouter.post("/flatRenterRegister", flatRentRegistration);
memberRouter.post("/shopOwner", shopOwnerRegistration);
memberRouter.post("/shopRenter", shopRentRegistration);
memberRouter.post("/verifyMemberOtp", verifyMemberOtp);
memberRouter.post("/memberResendOtp", memberResendOtp);
memberRouter.post("/adminApproveMember", adminApproveMember);
memberRouter.post("/memberLogin", memberLogin);
memberRouter.get("/getMemberDetail", verifyMemberToken, getMemberDetail);
memberRouter.post("/memberLogout", memberLogout);
memberRouter.get("/allMembersList", verifyAdminToken, allMembersList);
memberRouter.patch("/updateResidencyStatus/:id", updateResidencyStatus);

// get request
memberRouter.get("/getLoginMemberInfo", verifyMemberToken, getLoginMemberInfo);
memberRouter.get(
  "/singleMemberMaintenanceDetail",
  verifyMemberToken,
  singleMemberMaintenanceDetail
);

export default memberRouter;
