import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;
        console.log("Attempting to connect to MongoDB...");
        const connectionInstance = await mongoose.connect(mongoURL)
        console.log(`\n MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        throw error;
    }
}

export default connectDB;