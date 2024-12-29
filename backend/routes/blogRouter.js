import express from 'express';
const router = express.Router();
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog} from '../controller/blogCtrl.js';

router.post('/',authMiddleware ,isAdmin,createBlog);
router.put('/:id',authMiddleware ,isAdmin,updateBlog);
router.get('/:id' ,getBlog);
router.get('/' ,getAllBlogs);
router.delete('/:id',authMiddleware ,isAdmin ,deleteBlog);

export default router;