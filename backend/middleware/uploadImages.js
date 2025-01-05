import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Simulate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to ensure directory exists
const ensureDirectoryExists = async (dirPath) => {
  try {
    fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
  }
};

// Configures where and how uploaded files are stored.
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File destination:", path.join(__dirname, "../public/images"));
    cb(null, path.join(__dirname, "../public/images")); // Save files to `public/images`
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const generatedFilename = file.fieldname + "-" + uniqueSuffix + ".jpeg"; // Generate file name
    console.log("Generated file name:", generatedFilename); // Log the generated filename
    cb(null, generatedFilename); // Save with the unique name
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
  try {
    if (!req.files || req.files.length === 0) return next(); // Ensure files exist

    // Process all uploaded files
    await Promise.all(
      req.files.map(async (file) => {
        const outputFilePath = `public/images/products/${file.filename}`;

        // Ensure the destination directory exists
        await ensureDirectoryExists(path.dirname(outputFilePath));

        // Resize and convert the image
        await sharp(file.path)
          .resize(300, 300) // Resize to 300x300
          .toFormat("jpeg") // Convert to JPEG
          .jpeg({ quality: 90 }) // Set JPEG quality
          .toFile(outputFilePath); // Save processed image

        // Optionally remove the original file after processing
        await fs.unlink(file.path);
      })
    );

    next(); // Move to the next middleware
  } catch (error) {
    console.error("Error during product image processing:", error);
    res.status(500).send(`Image processing failed: ${error.message}`);
  }
};

// Blog Image Resize Middleware
const blogImgResize = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(); // Ensure files exist

    // Process all uploaded files
    await Promise.all(
      req.files.map(async (file) => {
        const outputFilePath = `public/images/blogs/${file.filename}`;

        // Ensure the destination directory exists
        await ensureDirectoryExists(path.dirname(outputFilePath));

        // Resize and convert the image
        await sharp(file.path)
          .resize(300, 300) // Resize to 300x300
          .toFormat("jpeg") // Convert to JPEG
          .jpeg({ quality: 90 }) // Set JPEG quality
          .toFile(outputFilePath); // Save processed image

        // Optionally remove the original file after processing
        await fs.unlink(file.path);
      })
    );

    next(); // Move to the next middleware
  } catch (error) {
    console.error("Error during blog image processing:", error);
    res.status(500).send(`Image processing failed: ${error.message}`);
  }
};

// Export middleware functions
export { uploadPhoto, blogImgResize, productImgResize };
