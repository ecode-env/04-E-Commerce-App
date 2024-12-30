import asyncHandler from 'express-async-handler';
import Category from '../models/productCategoryModel.js';
import validateMongoDBid from '../utils/validateMongodbid.js'



const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});








export {createCategory};