import dotenv from 'dotenv'
dotenv.config({
    path: '../.env'
});

import { initCloudinary } from './utils/cloudinary.js';
import connectDB from './db/index.js';
import app from "./app.js"

initCloudinary()
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
