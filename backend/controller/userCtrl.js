import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/jwtToken.js";
import validateMongoDBid from "../utils/validateMongodbid.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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

/* -------------Login--------------- */

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

    if (!findAdmin) throw new Error('User not found');

    if (findAdmin.role !== "admin") throw new Error('Not Authorized');

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
  getWishlist
};
