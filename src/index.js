
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import connectDb from "./dbConfig/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Listining at port number ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.error("MOngoDb Connection Error", error);
    })
