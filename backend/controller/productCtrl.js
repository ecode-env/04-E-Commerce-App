import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
  try {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});



const getProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.status(201).json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getProducts = await Product.find();
        res.status(200).json(getProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { createProduct, getProducts, getAllProducts };
