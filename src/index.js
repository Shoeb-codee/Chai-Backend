import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './db/index.js';
import app from './app.js'  // Add this import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with absolute path
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
