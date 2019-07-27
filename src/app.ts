import express, { request, response } from "express";
import cors from "cors";
import { router as productsRouter } from './routes/products';
import { router as categoriesRouter } from './routes/categories';
import { logMiddleware } from './middleware/log';
import { logErrors, clientErrorHandler, errorHandler } from './middleware/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logMiddleware);

app.use('/', productsRouter); //handle requests about products
app.use('/', categoriesRouter); //handle requests about categories

//handle errors
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

export {app};





