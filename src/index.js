import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with absolute path
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

/*
Added debugging to verify environment variables
console.log("Environment check:", {
    MONGO_URL: process.env.MONGO_URL,
    ENV_PATH: path.resolve(__dirname, '../.env')
});
*/

// Check if essential environment variables are present
if (!process.env.MONGO_URL) {
    console.error("MONGO_URL not found in environment variables");
    process.exit(1);
}

// Start the application
const startApp = async () => {
    try {
        await connectDB();
        // Your app initialization code here
    } catch (error) {
        console.error("ERROR: ", error);
        process.exit(1);
    }
}

startApp();