import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  const URL = process.env.MONGOURL;
  try {
    await mongoose.connect(URL);
    console.log("database connection insatlled successfully");
  } catch (error) {
    console.log("error to connect ot databse");
  }
};

export default connectDB;
