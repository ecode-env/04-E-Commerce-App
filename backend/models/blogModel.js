import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numView:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisLiked: {
        type: Boolean,
        default: false,
    },
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    disLikes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String,
        default: 'https://thumbs.dreamstime.com/z/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg?ct=jpeg'
    },
    author: {
        type: String,
        default: 'Admin'
    }
},
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true
    },
    timestamps: true,
}
);

//Export the model
const Blog = model('Blog', blogSchema);
export default Blog;