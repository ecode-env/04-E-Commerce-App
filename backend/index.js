import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';
import dbConnect from './config/dbConnect.js';
import authRout from './routes/authRoute.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

dbConnect();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRout);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(colors.bold.yellow(`Server is running on port ${PORT}.`));
});
