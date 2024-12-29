import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDBid from '../utils/validateMongodbid.js'


// Create a new blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});


// Update an existing blog.

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
        
    }
});

export { createBlog, updateBlog };
