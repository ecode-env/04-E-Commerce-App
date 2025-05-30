import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Function to upload a file to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    });
    return { url: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Export the function for use in other parts of the application
export default cloudinaryUploadImage;
