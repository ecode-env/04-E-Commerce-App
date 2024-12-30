import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDBid from "../utils/validateMongodbid.js";

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
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get the blog and increase numViews by one.

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const getBlog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(id, { $inc: { numView: 1 } }, { new: true });
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get all blogs.

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getAllBlogs = await Blog.find();
    res.json(getAllBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a blog.

const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDBid(blogId);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id, { new: true });
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// Like blog.

const likeBlog = asyncHandler(async (req, res) => {
  // Extract the blog ID from the request body
  const { blogId } = req.body;

  // Find the blog by its ID
  const blog = await Blog.findById(blogId);

  // Get the logged-in user's ID
  const loginUserId = req?.user?._id;

  // Check if the blog is already liked by the user
  const isLiked = blog?.isLiked;

  // Check if the user has already disliked the blog
  const alreadyDisLiked = blog?.disLikes?.includes(loginUserId?.toString());

  // If the user has already disliked the blog, remove the dislike
  if (alreadyDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { disLikes: loginUserId }, // Remove the user's ID from the disLikes array
        isLiked: false, // Set isLiked to false
      },
      { new: true } // Return the updated document
    );
    res.json(blog); // Send the updated blog as a response
    return; // Exit the function to prevent further processing
  }

  // If the blog is already liked by the user, remove the like
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId }, // Remove the user's ID from the likes array
        isLiked: false, // Set isLiked to false
      },
      { new: true } // Return the updated document
    );
    res.json(blog); // Send the updated blog as a response
  }
  // If the blog is not liked by the user, add the like
  else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId }, // Add the user's ID to the likes array
        isLiked: true, // Set isLiked to true
      },
      { new: true } // Return the updated document
    );
    res.json(blog); // Send the updated blog as a response
  }
});

export { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog };
