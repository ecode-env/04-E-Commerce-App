import mongoose from 'mongoose';
import colors from 'colors';

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);   
        console.log(colors.bold.green('Connection with database is established.'));
    } catch (error) {
        console.log(colors.bgRed(error.message));
    }
};

export default dbConnect;
