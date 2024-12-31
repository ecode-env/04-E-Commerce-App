import Coupon from "../models/couponModel.js";
import validateMongoDBid from "../utils/validateMongodbid.js";
import asyncHandler from "express-async-handler";

// Create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a coupon
const updateCoupon = asyncHandler(async (req, res) => {});

// Delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {});


// Get a single coupon
const getCoupon = asyncHandler(async (req, res) => {});


// Get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const getAllCoupons = await Coupon.find();
        res.status(200).json(getAllCoupons);
    } catch (error) {
        throw new Error(error);
    }
});






export { createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupons };