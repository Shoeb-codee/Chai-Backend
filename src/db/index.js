import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;
        const connectionInstance = await mongoose.connect(`${mongoURL}/${DB_NAME}`);
        console.log(`\n MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        throw error;
    }
}

export default connectDB;