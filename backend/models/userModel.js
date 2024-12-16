import mongoose from 'mongoose'; // This line imports the Mongoose library, which is a MongoDB
import bcrypt from 'bcrypt'; // This line imports the Bcrypt library for encrypt the password.


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});


// Hash the password before saving it to the database
userSchema.pre('save', (next) =>{

})

const User = mongoose.model('User', userSchema);
// Export the User model
export default  User;