import mongoose, { mongo } from 'mongoose';
import { DB_NAME } from "../constant.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // Dabatabase khan connect hua hai 
        console.log(`\n Mongodb Connected !! Db Host: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
}

export default connectDb;