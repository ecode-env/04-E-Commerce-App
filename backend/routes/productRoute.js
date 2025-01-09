import express from "express";
import { isAdmin, authMiddleware } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
} from "../controller/productCtrl.js";
import { 
  productImgResize, 
  uploadPhoto 
} from "../middleware/uploadImages.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

// Updated image upload route with logging
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.get("/:id", getProducts);
router.get("/", getAllProducts);
router.post("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);

export default router;
