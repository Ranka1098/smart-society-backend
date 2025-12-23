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
import forgetPassword from "../controller/Authentication/admin/forgetPassword.js";
import forgetPasswordOtp from "../controller/Authentication/admin/forgetPasswordOtp.js";
import resetPassword from "../controller/Authentication/admin/resetPassword.js";
import resendForgetPasswordOtp from "../controller/Authentication/admin/resendForgetPasswordOtp.js";

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

adminRouter.post("/forget-password", forgetPassword);
adminRouter.post("/verify-otp", forgetPasswordOtp);
adminRouter.post("/reset-password", resetPassword);
adminRouter.post("/resend-forgetpassword-otp", resendForgetPasswordOtp);

export default adminRouter;
