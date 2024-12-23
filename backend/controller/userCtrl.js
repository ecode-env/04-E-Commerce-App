import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/jwtToken.js";
import validateMongoDBid from "../utils/validateMongodbid.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
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
};
