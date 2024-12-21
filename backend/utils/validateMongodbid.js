import mongoose from "mongoose";

const validateMongoDBid = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("This id is not valid or not Found.");
};
export default validateMongoDBid;