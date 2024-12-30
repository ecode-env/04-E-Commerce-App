import express from 'express';
import { createCategory } from '../controller/productCategoryCtrl.js';
import {authMiddleware, isAdmin} from '../middleware/authMiddleware.js'



const router = express.Router();


router.post('/',authMiddleware,isAdmin, createCategory);





export default router;