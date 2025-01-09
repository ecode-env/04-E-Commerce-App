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
import { uploadPhoto, blogImgResize } from "../middleware/uploadImages.js";

router.post("/", authMiddleware, isAdmin, createBlog);

router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);

router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.patch("/likes", authMiddleware, isAdmin, likeBlog);
router.patch("/dislikes", authMiddleware, isAdmin, dislikeBlog);

export default router;
