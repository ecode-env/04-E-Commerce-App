const mongoose = require("mongoose"); // Erase if already required

const { Schema, model, Types } = mongoose;
// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timeseries: true }
);

//Export the model
const Category = model("Category", categorySchema);
export default Category;
