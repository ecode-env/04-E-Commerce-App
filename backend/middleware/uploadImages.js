import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// Simulate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

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
  if (!req.files) return next();

  // Define the directory for resized images
  const productsDir = path.join(__dirname, "../public/images/products");

  try {
    // Ensure the directory exists
    await fs.mkdir(productsDir, { recursive: true });

    // Resize and save each image
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(productsDir, file.filename));
          
      })
    );

    next();
  } catch (error) {
    console.error("Error during image processing:", error);
    res.status(500).send({ error: "Image processing failed" });
  }
};

// Blog Image Resizing Middleware

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();

  // Define the directory for resized images
  const productsDir = path.join(__dirname, "../public/images/blog");

  try {
    // Ensure the directory exists
    await fs.mkdir(productsDir, { recursive: true });

    // Resize and save each image
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(productsDir, file.filename));
          
      })
    );

    next();
  } catch (error) {
    console.error("Error during image processing:", error);
    res.status(500).send({ error: "Image processing failed" });
  }
};

// Export middleware functions
export { uploadPhoto, productImgResize, blogImgResize };
