import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";

import generateToken from "../config/jwtToken.js";
import validateMongoDBid from "../utils/validateMongodbid.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import uniqid from "uniqid";
import sendEmail from "../controller/emailCtrl.js";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new user
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    // If user already exists, throw an error message
    throw new Error("User already exists");
  }
});

// login user controller

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const findUser = await User.findOne({ email });

  // Check if user exists and password matches
  if (findUser && (await findUser.isPasswordMatch(password))) {
    // Password matches, send user data or token
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id), // generate token
    });
  } else {
    // Invalid credentials
    throw new Error("Invalid Credentials");
  }
});

// login admin user

const loginAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const findAdmin = await User.findOne({ email });

    if (!findAdmin) throw new Error("User not found");

    if (findAdmin.role !== "admin") throw new Error("Not Authorized");

    // Check if password matches
    const isMatch = await findAdmin.isPasswordMatch(password);
    if (!isMatch) throw new Error("Invalid Credentials");

    // Password matches, send user data or token
    const refreshToken = await generateRefreshToken(findAdmin.id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin._id,
      firstName: findAdmin.firstName,
      lastName: findAdmin.lastName,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      token: generateToken(findAdmin._id), // generate token
    });
  } catch (error) {
    next(error);
  }
});

// cookies handling

const handlerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies!");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched.");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("There something wrong with refresh token.");
    const accessToken = generateRefreshToken(user?.id);
    res.json({ accessToken });
  });
  res.json(user);
});

// logout

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie) throw new Error("No refresh token present in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // forbidden
});

// Update user

const updateUser = asyncHandler(async (req, res) => {
  req.user;
  const { _id } = req.user;
  validateMongoDBid;
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Set user address

const setUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const setUserAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(setUserAddress);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users from data base.

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get by ID single user from data base

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const getUser = await User.find(User?.findById(id));
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete by ID single user from data base;

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);

  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      msg: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBid(id);
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      msg: "User Unlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
//-------------update user password ----------------------------
const updatePassword = asyncHandler(async (req, res) => {
  // Destructure the user ID from the authenticated user object in the request
  const { _id } = req.user;

  // Extract the password from the request body
  const { password } = req.body;

  // Validate the provided MongoDB ID to ensure it's in the correct format
  validateMongoDBid(_id);

  // Find the user in the database by their ID
  const user = await User.findById(_id);

  // Check if a new password is provided in the request
  if (password) {
    // Update the user's password with the new value
    user.password = password;

    // Save the updated user record to the database
    const updatePassword = await user.save();

    // Respond with the updated user object as JSON
    res.json(updatePassword);
  } else {
    // If no password is provided, return the user object as is
    res.json(user);
  }
});

//-------------Forgat password ----------------

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body; // Get the email from the request body
  const user = await User.findOne({ email }); // Find the user in the database using the email

  if (!user) {
    throw new Error("User not found with this email"); // If user not found, throw an error
  }

  try {
    // Generate the password reset token by calling the method
    const token = await user.createPasswordResetToken();

    // Save the user document with the reset token and expiration time
    await user.save();

    // Create a password reset URL with the token
    const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10 minutes from now. <a href="http://localhost:6000/api/user/reset-password/${token}">Click here</a>`;

    // Set up the email data
    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot password",
      html: resetURL,
    };

    // Send the email with the reset URL
    await sendEmail(data);

    // Send a response back to the client
    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    throw new Error(error); // Handle any errors
  }
});

// ---------------- Reset Password --------------------------------

// Function to handle password reset functionality
const resetPassword = asyncHandler(async (req, res) => {
  // Get the new password from the request body
  const { password } = req.body;

  // Get the token from the request parameters (typically part of the URL)
  const { token } = req.params;

  // Hash the token using SHA-256 to match the stored hashed token in the database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find a user with the matching hashed token and ensure the token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken, // Match the hashed token
    passwordResetExpires: { $gt: Date.now() }, // Ensure the token's expiry time is in the future
  });

  // If no user is found or the token is invalid/expired, throw an error
  if (!user) {
    throw new Error("Token has expired, Please try again later.");
  }

  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  res.json(user);
});

// Get wishlist

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    // console.log(findUser)
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// user cart items
const userCart = asyncHandler(async (req, res, next) => {
  // Destructure cart from the request body and _id from req.user
  const { cart } = req.body;
  const { _id } = req.user;

  // Validate if the provided MongoDB ID is valid
  validateMongoDBid(_id);

  try {
    let products = []; // Array to hold processed cart items
    const user = await User.findById(_id); // Find the user by their ID

    // Check if the user already has a cart and remove it if it exists
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) await alreadyExistCart.remove();

    // Iterate over each item in the cart
    for (let i = 0; i < cart.length; i++) {
      let object = {}; // Object to hold details of a single cart item
      object.product = cart[i]._id; // Product ID
      object.quantity = cart[i].quantity; // Quantity of the product
      object.color = cart[i].color; // Color of the product

      // Find the product by its ID and select its price
      let getPrice = await Product.findById(cart[i]._id).select("price");

      // If product is found, add its price to the object
      object.price = getPrice.price;

      // Add the object to the products array
      products.push(object);
    }

    let cartTotal = 0; // Initialize total cost of the cart

    // Calculate the total cost of the cart
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].quantity;
    }

    // Create a new cart document with the processed products, total cost, and user ID
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user._id,
    }).save(); // Save the cart to the database

    // Send the newly created cart as the response
    res.json(newCart);
  } catch (error) {
    // If an error occurs, throw it to be handled by the asyncHandler
    throw new Error(error);
  }
});

// Get user cart information

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// Set empty cart information for the user cart.

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Validate MongoDB ID
  validateMongoDBid(_id);

  try {
    // Find the user by ID
    const user = await User.findOne({ _id });

    // Find and remove the user's cart
    const cart = await Cart.findOneAndDelete({ orderby: user._id });

    // Return the removed cart as a response
    res.json(cart);
  } catch (error) {
    // Handle any errors
    throw new Error(error);
  }
});

// Apply a coupon to the user's cart

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { coupon } = req.body; // Extract the coupon code from the request body
  const { _id } = req.user; // Get the user's ID from the request (assumes user is authenticated)

  // Validate the MongoDB ID to ensure it's valid
  validateMongoDBid(_id);

  // Find the coupon in the database by its name
  const validCoupon = await Coupon.findOne({ name: coupon });

  // If the coupon is not found or is null, throw an error
  if (!validCoupon) {
    throw new Error("Invalid coupon code");
  }

  // Find the user in the database by their ID
  const user = await User.findOne({ _id });

  // Retrieve the user's cart, populating the products with their details
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");

  // Calculate the total after applying the coupon discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  // Update the user's cart with the new total after discount
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  // Respond with the total after discount
  res.json(totalAfterDiscount);
});

// Create a new order with the user's cart

const createOrder = asyncHandler(async (req, res) => {
  // Destructure COD (Cash on Delivery) and couponApplied from the request body
  const { COD, couponApplied } = req.body;

  // Destructure _id from the authenticated user's information
  const { _id } = req.user;

  // Validate the MongoDB ID to ensure it's a valid ObjectId
  validateMongoDBid(_id);

  try {
    // If COD is not provided, throw an error indicating the order creation failed
    if (!COD) throw new Error("Create cash order failed");

    // Find the user by their ID
    const user = await User.findById(_id);

    // Find the user's cart associated with their user ID
    const userCart = await Cart.findOne({ orderby: user._id });

    let finalAmount = 0;

    // If a coupon is applied and there's a totalAfterDiscount in the cart, use it as the final amount
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      // Otherwise, use the cartTotal as the final amount
      finalAmount = userCart.cartTotal;
    }

    // Create a new order with the products from the user's cart
    let newOrder = await new Order({
      products: userCart.products, // List of products in the order
      paymentIntent: {
        id: uniqid(), // Unique identifier for the payment
        method: "COD", // Payment method
        amount: finalAmount, // Final amount to be paid
        status: "Cash on Delivery", // Status of the payment
        createdAt: Date.now(), // Current timestamp
        currency: "USD", // Currency of the payment
      },
      orderby: userCart._id, // Reference to the user who placed the order
      orderStatus: "Cash on Delivery", // Initial status of the order
    }).save(); // Save the new order to the database

    // Prepare bulk write operations to update product quantities
    let update = userCart.products.map((product) => {
      return {
        updateOne: {
          filter: { _id: product._id }, // Filter by product ID
          update: {
            $inc: { quantity: -product.quantity, sold: +product.quantity },
          }, // Decrement quantity and increment sold count
        },
      };
    });

    // Execute bulk write operations to update product inventory
    const updated = await Product.bulkWrite(update, {});

    // Send a success response to the client
    res.json({ message: "Success" });
  } catch (error) {
    // Catch and throw any errors encountered during the process
    throw new Error(error);
  }
});

export {
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
};
