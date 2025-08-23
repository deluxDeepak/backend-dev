
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import connectDb from "./dbConfig/dbConnect.js";

dotenv.config({
    path:"./env"
})

connectDb();
