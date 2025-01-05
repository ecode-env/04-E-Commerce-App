import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import validateMongoDBid from "../utils/validateMongodbid.js";
import cloudinaryUploadImage from "../utils/cloudinary.js"
import fs from "fs";
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
  validateMongoDBid(id);
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
  validateMongoDBid(id);
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
  validateMongoDBid(id);
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
    let query = Product.find(JSON.parse(queryStr));
    // Example: The final query will be Product.find({ price: { $gte: '100' } });

    //-------------------- Sorting -------------------------

    // Step 1: Check if the 'sort' parameter exists in the request query
    if (req.query.sort) {
      // Step 2: Split the 'sort' parameter by commas and join them with spaces
      // Explanation: MongoDB's `sort()` method expects a string where fields are separated by spaces
      const sortBy = req.query.sort.split(",").join(" ");
      // Example: If req.query.sort = 'price,rating', then sortBy = 'price rating'

      // Step 3: Apply the sort criteria to the query
      query = query.sort(sortBy);
      // Example: If sortBy = 'price rating', the query will sort by 'price' (ascending) and then by 'rating' (ascending)
    } else {
      // Step 4: If no 'sort' parameter is provided, sort by 'createdAt' field in descending order (default behavior)
      query = query.sort("-createdAt");
      // Explanation: The '-' indicates descending order. Without it, the sort would be ascending.
    }
    // -----------------<< Limiting thr fields >>----------------
    // Step 1: Check if the 'fields' parameter exists in the request query
    if (req.query.fields) {
      // Step 2: Split the 'fields' parameter by commas and join them with spaces
      // Explanation: MongoDB's `select()` method expects fields to be separated by spaces
      const fields = req.query.fields.split(",").join(" ");
      // Example: If req.query.fields = 'name,price', then fields = 'name price'

      // Step 3: Use the `select` method to specify which fields to include in the response
      query = query.select(fields);
      // Example: query.select('name price') will include only the 'name' and 'price' fields in the response
    } else {
      // Step 4: If no 'fields' parameter is provided, include only the `__v` field by default
      query = query.select("-__v");
      // Explanation: The `__v` field is often used for internal versioning in MongoDB documents.
    }

    // -----------------<< Pagination >>----------------

    const page = req.query.page;

    const limit = req.query.limit;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCounter = await Product.countDocuments();
      if (skip >= productCounter) throw new Error("This page not found");
    }

    const product = await query;

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  validateMongoDBid(_id);
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    } else {
      const user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rating product

const rating = asyncHandler(async (req, res) => {
  // Extract user ID from the request object
  const { _id } = req.user;

  // Extract product ID, comment and star rating from the request body
  const { prodId, star,comment } = req.body;

  // Validate the user ID to ensure it's a valid MongoDB ObjectId
  validateMongoDBid(_id);

  try {
    // Find the product in the database by its ID
    const product = await Product.findById(prodId);

    // Check if the user has already rated this product
    const alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      // If the user has already rated, update their existing rating
   await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated }, // Match the specific rating
        },
        {
          $set: {
            "ratings.$.star": star, // Update the star field of the matched rating
            "ratings.$.comment": comment, // Update the comment field of the matched rating
          },
        },
        { new: true } // Option to return the updated document (doesn't work with `updateOne`)
      );
    } else {
      // If the user has not rated, add a new rating to the product
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star, // Add the star rating
              comment: comment, // Add the comment
              postedBy: _id, // Associate the rating with the user
            },
          },
        },
        { new: true } // Return the updated document
      );
    }
    const getAllRatings = await Product.findById(prodId);
    const totalRating = getAllRatings.ratings.length;
    const ratingSum = getAllRatings.ratings.map(item => item.star).reduce((prev, curr) => curr + prev, 0);
    const actualRating = Math.round(ratingSum / totalRating);
    const finalRate = await Product.findByIdAndUpdate(prodId, {
      totalRating: actualRating,
    },{new: true});
    res.json(finalRate);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json(error);
  }
});


// Upload images
const uploadImages = asyncHandler(async (req, res) => { 
  const { id } = req.params;
  validateMongoDBid(id); // Validate the MongoDB ID

  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images"); // Cloudinary image upload function
    const urls = []; // Array to store image URLs

    const files = req.files; // Files uploaded via multer

    for (const file of files) {
      const { path } = file; // Get the path of each uploaded file
      const newPath = await uploader(path); // Upload to Cloudinary and get the new path (URL)
      urls.push(newPath.url); // Push the URL to the array
      fs.unlinkSync(path); // Delete the file from the local storage
    }

    // Update the product with the uploaded image URLs
    const findProduct = await Product.findByIdAndUpdate(id, {
      images: urls, // Update the images field with the Cloudinary URLs
    }, { new: true });

    // Send the updated product data back in the response
    res.json(findProduct);

  } catch (error) {
    console.error("Error uploading images:", error); // Log the error for debugging
    res.status(500).json({ message: "Image upload failed", error: error.message }); // Send an error response
  }
});

export {
  createProduct,
  getProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
};
