import asyncHandler from "express-async-handler";
import blogCategory from "../models/blogCatModel.js";
import validateMongoDBid from "../utils/validateMongodbid.js";

// Create a new blog category

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await blogCategory.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a blog category

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const updateCategory = await blogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a blog category

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const deleteCategory = await blogCategory.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});


// Get a single blog category

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    try {
      const getCategory = await blogCategory.findById(id);
      res.json(getCategory);
    } catch (error) {
      throw new Error(error);
    }
  
});


// Get all blog categories

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getAllCategories = await blogCategory.find();
        res.json(getAllCategories);
    } catch (error) {
      throw new Error(error);
        
    }
});

// Export
export { createCategory, updateCategory, deleteCategory, getCategory,getAllCategories};
