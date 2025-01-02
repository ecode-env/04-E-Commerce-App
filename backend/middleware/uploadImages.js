import multer from 'multer';
import path from 'path';

// Configure storage for uploaded files
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images')); // Save files to `public/images`
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg'); // Save with a unique name
    },
});

// Filter files by MIME type
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept valid image files
    } else {
        cb({ message: 'Unsupported file format' }, false); // Reject other files
    }
};

// Configure the `multer` instance
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 }, // Limit file size to 2 MB
});



export default uploadPhoto;