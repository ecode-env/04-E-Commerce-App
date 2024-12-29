import express from 'express';
const router = express.Router();
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import createBlog from '../controller/blogCtrl.js';

router.post('/',authMiddleware ,isAdmin,createBlog);

export default router;