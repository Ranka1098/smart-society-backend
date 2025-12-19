import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/database.js";
import adminRouter from "./src/routes/adminRouter.js";
import memberRouter from "./src/routes/memberRouter.js";
import maintenanceRouter from "./src/routes/maintenanceRouter.js";
import noticeRouter from "./src/routes/noticeRouter.js";
import staffRouter from "./src/routes/staffRouter.js";
import expenseRouter from "./src/routes/expenseRouter.js";
import complaintRouter from "./src/routes/compliantRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/", adminRouter);
app.use("/", memberRouter);
app.use("/", expenseRouter);
app.use("/", maintenanceRouter);
app.use("/", noticeRouter);
app.use("/", staffRouter);
app.use("/", complaintRouter);
app.use("/uploads", express.static("uploads"));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });
