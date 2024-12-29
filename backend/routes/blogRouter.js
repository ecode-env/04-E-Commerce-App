import express from 'express';
const router = express.Router();
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import {createBlog, updateBlog, getBlog} from '../controller/blogCtrl.js';

router.post('/',authMiddleware ,isAdmin,createBlog);
router.put('/:id',authMiddleware ,isAdmin,updateBlog);
router.get('/:id' ,getBlog);

export default router;