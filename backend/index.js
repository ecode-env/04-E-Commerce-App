import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';
import dbConnect from './config/dbConnect.js';
import authRouter from './routes/authRoute.js';
import productRouter from './routes/productRoute.js';
import blogRouter from './routes/blogRouter.js';
import blogCatRoute from './routes/blogCatRoute.js';
import brandRoute from './routes/brandRoute.js';
import categoryRouter from './routes/productCategoryRoute.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dbConnect();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog-category', blogCatRoute);
app.use('/api/brand', brandRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(colors.bold.yellow(`Server is running on port ${PORT}.`));
});
