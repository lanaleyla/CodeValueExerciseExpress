import express, { request, response } from "express";
import cors from "cors";
import { router as productsRouter } from './routes/products';
import { router as categoriesRouter } from './routes/categories';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', productsRouter); //handle requests about products
app.use('/', categoriesRouter); //handle requests about categories

export {app};





