import asyncHandler from "express-async-handler";
import Category from "../models/productCategoryModel.js";
import validateMongoDBid from "../utils/validateMongodbid.js";

// Create a new product category

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a product category

const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params;
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

export { createCategory };
