import express from 'express';
const router = express.Router();
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import {createBlog, updateBlog} from '../controller/blogCtrl.js';

router.post('/',authMiddleware ,isAdmin,createBlog);
router.put('/:id',authMiddleware ,isAdmin,updateBlog);

export default router;