import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new user
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    // If user already exists, throw an error message
    throw new Error('User already exists');
  }
});

// const createUser = async (req, res) => {
//     const email = req.body.email;
//     const findUser = await User.findOne({ email });
//     if (!findUser) {
//         try {
//             const newUser = await User.create(req.body);
//             res.status(201).json({ message: 'User created successfully', user: newUser });
//         } catch (error) {
//             res.status(500).json({ error: 'An error occurred while creating the user' });
//         }
//     } else {
//         res.status(400).json({ error: 'User with this email already exists' });
//     }
// };

export { createUser };
