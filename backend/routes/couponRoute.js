import express from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controller/couponCtrl.js";
import {authMiddleware, isAdmin} from '../middleware/authMiddleware.js'

const router = express.Router();


router.post("/",authMiddleware, isAdmin,createCoupon);
router.get('/', authMiddleware, isAdmin,getAllCoupons);
router.put('/:id', authMiddleware, isAdmin,updateCoupon);
router.delete('/:id', authMiddleware, isAdmin,deleteCoupon);


export default router;