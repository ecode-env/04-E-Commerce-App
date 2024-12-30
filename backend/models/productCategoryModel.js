import mongoose from "mongoose"; // Erase if already required

const { Schema, model, Types } = mongoose;
// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema(
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
const Category = model("PCategory", productCategorySchema);
export default Category;
