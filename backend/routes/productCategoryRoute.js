import express from "express";
import {
  createCategory,
  updateCategory,
} from "../controller/productCategoryCtrl.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);

export default router;
