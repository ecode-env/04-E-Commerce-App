import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import validateMongoDBid from "../utils/validateMongodbid.js";

// Create a new brand Brand

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a brand Brand

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a brand Brand

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});


// Get a single brand Brand

const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    try {
      const getBrand = await Brand.findById(id);
      res.json(getBrand);
    } catch (error) {
      throw new Error(error);
    }
  
});


// Get all brand categories

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllCategories = await Brand.find();
        res.json(getAllCategories);
    } catch (error) {
      throw new Error(error);
        
    }
});

// Export
export { createBrand, updateBrand, deleteBrand, getBrand,getAllBrand};
