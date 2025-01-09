import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// Simulate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const multerStorage = multer.diskStorage({});



// Filter files by MIME type
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept valid image files
  } else {
    cb({ message: "Unsupported file format" }, false); // Reject other files
  }
};

// Configure the `multer` instance
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 }, // Limit file size to 2 MB
});

// Product Image Resize Middleware
const productImgResize = async (req, res, next) => {
};


// Export middleware functions
export { uploadPhoto, productImgResize };
