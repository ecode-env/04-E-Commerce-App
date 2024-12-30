import mongoose from "mongoose"; // Erase if already required

const { Schema, model, Types } = mongoose;
// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

//Export the model
const blogCategory = model("blogCategory", blogCategorySchema);
export default blogCategory;
