import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

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
  if (findUser && await findUser.isPasswordMatch(password)) {
    // Password matches, send user data or token
    res.json(findUser);
  } else {
    // Invalid credentials
    throw new Error("Invalid Credentials");
  }
});

export { createUser, loginUserCtrl };
