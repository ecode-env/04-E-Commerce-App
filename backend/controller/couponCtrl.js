import Coupon from "../models/couponModel";
import validateMongoDBid from "../utils/validateMongodbid.js";
import asyncHandler from "express-async-handler";

// Create a new coupon
const createCoupon = asyncHandler(async (req, res) => {});






export { createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupons };