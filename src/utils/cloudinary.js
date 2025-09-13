import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Function to initialize Cloudinary config
export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(
      localFilePath, // normalize Windows path
      { resource_type: "auto" }
    );

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};
