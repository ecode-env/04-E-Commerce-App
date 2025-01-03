import express from "express";
const router = express.Router();
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} from "../controller/blogCtrl.js";
import { blogImgResize, uploadPhoto } from "../middleware/uploadImages.js";

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware, // Authenticate user
  isAdmin, // Check for admin privileges
  uploadPhoto.array("images", 2), // Upload up to 10 files
  blogImgResize, // Resize and process images
  uploadImages
);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.patch("/likes", authMiddleware, isAdmin, likeBlog);
router.patch("/dislikes", authMiddleware, isAdmin, dislikeBlog);

export default router;
