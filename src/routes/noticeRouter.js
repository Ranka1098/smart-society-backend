import express from "express";
import createNotice from "../controller/notice/createNotice.js";
import getNotice from "../controller/notice/getNotice.js";
import { deleteNotice } from "../controller/notice/deleteNotice.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import verifyMemberToken from "../middleware/verifyMemberToken.js";
const noticeRouter = express.Router();

noticeRouter.post("/createNotice", verifyAdminToken, createNotice);
noticeRouter.get("/admin/getNotice", verifyAdminToken, getNotice);
noticeRouter.get("/member/getNotice", verifyMemberToken, getNotice);
noticeRouter.post("/deleteNotice/:id", verifyAdminToken, deleteNotice);

export default noticeRouter;
