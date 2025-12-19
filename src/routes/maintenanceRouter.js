import express from "express";
import createMaintenance from "../controller/maitenance/createMaintenance.js";
import sendMaintenanceNotification from "../controller/maitenance/sendMaintenanceNotification.js";
import addMemberMaitenancePayment from "../controller/maitenance/addMemberMaitenancePayment.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";
import getAllMemberMaintenancePaymentList from "../controller/maitenance/getAllMemberMaintenancePaymentList.js";
import generateSocietyMaintenanceBill from "../controller/maitenance/generateSocietyMaintenanceBill.js";

const maintenanceRouter = express.Router();
maintenanceRouter.post("/createMaintenance", createMaintenance);
maintenanceRouter.post(
  "/sendMaintenanceNotification",
  sendMaintenanceNotification
);
maintenanceRouter.post(
  "/addMemberMaitenancePayment",
  verifyAdminToken, // ✅ buildingCode verify here
  addMemberMaitenancePayment
);
maintenanceRouter.get(
  "/getAllMemberMaintenancePaymentList",
  verifyAdminToken,
  getAllMemberMaintenancePaymentList
);
maintenanceRouter.get(
  "/generate-maintenance-bill/:paymentId",
  generateSocietyMaintenanceBill
);

export default maintenanceRouter;
