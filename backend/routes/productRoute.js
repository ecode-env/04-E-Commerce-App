import express from 'express';
import { createProduct, getProducts, getAllProducts } from '../controller/productCtrl.js';

const router = express.Router();



router.post('/', createProduct);
router.get('/:id', getProducts);
router.get('/', getAllProducts);

export default router;