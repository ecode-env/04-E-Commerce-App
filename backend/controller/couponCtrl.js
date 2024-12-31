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
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBid(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error);
    }
});


// Get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const getAllCoupons = await Coupon.find();
        res.status(200).json(getAllCoupons);
    } catch (error) {
        throw new Error(error);
    }
});






export { createCoupon, updateCoupon, deleteCoupon, getAllCoupons };