import express from 'express';
import { addProduct } from '../controller/ProductController';

const Router = express.Router();

Router.post("/addProduct", addProduct)


export default Router;