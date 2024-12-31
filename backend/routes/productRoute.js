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
} from "../controller/productCtrl.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getProducts);
router.get("/", getAllProducts);
router.post("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put('/wishlist',authMiddleware, addToWishList)
router.put('/rating',authMiddleware, rating)

export default router;