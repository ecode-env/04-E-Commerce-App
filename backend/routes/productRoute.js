import express from 'express';
import { createProduct, getProducts } from '../controller/productCtrl.js';

const router = express.Router();



router.post('/', createProduct);
router.get('/:id', getProducts);

export default router;