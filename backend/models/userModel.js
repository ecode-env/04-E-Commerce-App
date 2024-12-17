import mongoose from "mongoose"; // Importing Mongoose library
import bcrypt from "bcrypt"; // Importing Bcrypt library for hashing passwords

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  }
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10); // Asynchronous salt generation
    this.password = await bcrypt.hash(this.password, salt); // Hashing password asynchronously
    next();
  } catch (error) {
    // next(error);  // Pass any errors to the next middleware
  }
});

userSchema.methods.isPasswordMatch = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};
const User = mongoose.model("User", userSchema);
// Export the User model
export default User;
