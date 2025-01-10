import express from "express";
import {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handlerRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  setUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  updateOrderStatus,
} from "../controller/userCtrl.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get("/all-users", getAllUsers);
router.get("/get-orders", authMiddleware, getOrder);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);


router.get("/refresh",handlerRefreshToken);
router.get('/logout', logoutUser);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete("/:id",isAdmin, deleteUser);
router.put("/:edit-user",authMiddleware, updateUser);
router.put("/save-address",authMiddleware, setUserAddress);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin,unblockUser);

export default router;
