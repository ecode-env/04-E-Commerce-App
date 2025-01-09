import { v2 as cloudinary } from "cloudinary";

console.log(process.env.CLOUD_NAME);

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Function to upload a file to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpload, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        { resource_type: "auto" }
      );
    });
  });
};

// Export the function for use in other parts of the application
export default cloudinaryUploadImage;
