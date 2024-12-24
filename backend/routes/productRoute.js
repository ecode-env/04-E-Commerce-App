import express from 'express';
import { createProduct, getProducts, getAllProducts, updateProduct, deleteProduct } from '../controller/productCtrl.js';

const router = express.Router();



router.post('/', createProduct);
router.get('/:id', getProducts);
router.get('/', getAllProducts);
router.post('/:id', updateProduct);

export default router;