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
} from "../controller/userCtrl.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.get("/all-users", getAllUsers);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/refresh",handlerRefreshToken);
router.get('/logout', logoutUser);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.delete("/:id",isAdmin, deleteUser);
router.put("/:edit-user",authMiddleware, updateUser);
router.put("/save-address",authMiddleware, setUserAddress);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin,unblockUser);

export default router;
