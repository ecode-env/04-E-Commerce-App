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
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a product category

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});


// Get a single product category

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    try {
      const getCategory = await Category.findById(id);
      res.json(getCategory);
    } catch (error) {
      throw new Error(error);
    }
  
});


// Export
export { createCategory, updateCategory, deleteCategory, getCategory};
