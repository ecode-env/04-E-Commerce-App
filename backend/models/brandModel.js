import mongoose from "mongoose"; // Erase if already required

const { Schema, model, Types } = mongoose;
// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
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
const Brand = model("Brand", brandSchema);
export default Brand;
