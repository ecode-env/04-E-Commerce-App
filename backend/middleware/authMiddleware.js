import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let jwtToken;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    jwtToken = req?.headers?.authorization?.split(" ")[1];
    try {
      if (jwtToken) {
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error(
        "Not Authorized token received, Please try logging in again"
      );
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // Destructure the user object added to the request
  const { email } = req.user;

  // Find the user by email in the database
  const isAdminUser = await User.findOne({ email });

  // Check if user exists and has an admin role
  if (!isAdminUser || isAdminUser.role !== "admin")
    throw new Error("Unauthorized access, only admin users are allowed");
  // If user is admin, proceed to the next middleware or route
  next();
});

export { authMiddleware, isAdmin };
