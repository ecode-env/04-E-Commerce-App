import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

// Configure storage for uploaded files
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images")); // Save files to `public/images`
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg"); // Save with a unique name
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

const productImgResize = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(); // Ensure files exist

    // Process all uploaded files
    await Promise.all(
      req.files.map(async (file) => {
        const outputFilePath = `public/images/products/${file.filename}`;

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
    res.status(500).send("Image processing failed.");
  }
};

// Resize images for blog posts

const blogImgResize = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(); // Ensure files exist

    // Process all uploaded files
    await Promise.all(
      req.files.map(async (file) => {
        const outputFilePath = `public/images/blogs/${file.filename}`;

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
    res.status(500).send("Image processing failed.");
  }
};

export { uploadPhoto, blogImgResize };
