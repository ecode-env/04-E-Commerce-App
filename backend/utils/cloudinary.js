import cloudinary from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Function to upload a file to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
      // Await the Cloudinary upload method
      const result = await cloudinary.uploader.upload(fileToUpload, {
        resource_type: "auto", // Automatically detect the file type
      });
  
      // Return the secure URL of the uploaded file
      return { url: result.secure_url };
    } catch (error) {
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  // Export the function for use in other parts of the application
  export default cloudinaryUploadImage;
  