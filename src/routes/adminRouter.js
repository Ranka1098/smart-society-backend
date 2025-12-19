import express from "express";
import adminRegister from "../controller/Authentication/admin/adminRegister.js";
import resendOtp from "../controller/Authentication/admin/resendOtp.js";
import verifyAdminOtp from "../controller/Authentication/admin/verifyAdminOtp.js";
import adminLogin from "../controller/login/admin/adminLogin.js";
import adminLogout from "../controller/logout/admin/adminLogout.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import getAdminDetails from "../controller/login/admin/getAdminDetails.js";
import allPendingRequest from "../controller/Authentication/admin/allPendingRequest.js";
import adminRejectMember from "../controller/Authentication/admin/adminRejectMember.js";

import addMaitenance from "../controller/Authentication/admin/addMaitenance.js";
import deleteMember from "../controller/Authentication/member/deleteMember.js";
const adminRouter = express.Router();

adminRouter.post("/adminregister", adminRegister);
adminRouter.post("/verifyAdminOtp", verifyAdminOtp);
adminRouter.post("/resendOtp", resendOtp);
adminRouter.post("/adminLogin", adminLogin);
adminRouter.post("/adminLogout", adminLogout);
adminRouter.get("/getAdminDetails", verifyAdminToken, getAdminDetails);
adminRouter.get("/getAllPendingMember", allPendingRequest);
adminRouter.post("/adminRejectMember", adminRejectMember);

adminRouter.post("/addMaintenance", verifyAdminToken, addMaitenance);
adminRouter.delete("/deleteMember/:id", verifyAdminToken, deleteMember);

export default adminRouter;
