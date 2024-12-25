import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

// Create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(deleteProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by id
const getProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.status(201).json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    // Step 1: Copy all query parameters from the request object
    const queryObj = { ...req.query };
    // Example: If req.query is { price: { gte: '100' }, page: '2', sort: 'price' },
    // queryObj will now be { price: { gte: '100' }, page: '2', sort: 'price' }

    // Step 2: Define fields to exclude from filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    // These fields are used for other purposes like pagination, sorting, etc., and should not be part of the filtering logic.

    // Step 3: Remove excluded fields from the query object
    excludeFields.forEach((el) => delete queryObj[el]);
    // Example: After this step, queryObj will be { price: { gte: '100' } }

    // Step 4: Convert the query object to a JSON string for easier manipulation
    let queryStr = JSON.stringify(queryObj);
    // Example: queryStr will now be '{"price":{"gte":"100"}}'

    // Step 5: Replace comparison operators (gte, gt, lte, lt) with MongoDB-compatible operators ($gte, $gt, $lte, $lt)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // Explanation: The regex \b(gte|gt|lte|lt)\b matches exact words like 'gte', 'gt', etc.
    // Example: queryStr becomes '{"price":{"$gte":"100"}}'

    // Step 6: Parse the modified query string back into an object
    // Use the object with MongoDB's `find` method to filter data in the database
    const query = Product.find(JSON.parse(queryStr));
    // Example: The final query will be Product.find({ price: { $gte: '100' } });

    // Sorting

    const product = await query;
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  createProduct,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
