import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from '../controller/ProductController.js';
import ExpressFormidable from 'express-formidable';
import { isAdmin, IsSignedIn } from '../middleware/AuthMidlleWear.js';

const Router = express.Router();

// Use ExpressFormidable in the routes that need it, no need for app.use() here
Router.post("/addProduct", IsSignedIn, isAdmin, ExpressFormidable(), addProduct);
Router.get("/getAllProduct", IsSignedIn, isAdmin, ExpressFormidable(), getAllProduct);
Router.get("/getSingleProduct", IsSignedIn, isAdmin, ExpressFormidable(), getSingleProduct);
Router.delete("/deleteProduct", IsSignedIn, isAdmin, ExpressFormidable(), deleteProduct);
Router.put("/updateProduct", IsSignedIn, isAdmin, ExpressFormidable(), updateProduct);

export default Router;
