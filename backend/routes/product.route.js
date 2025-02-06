import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from '../controllers/product.controller.js';
import ExpressFormidable from 'express-formidable';
import { isAdmin, IsSignedIn } from '../middleware/auth.midlleWear.js';

const Router = express.Router();

// Use ExpressFormidable in the routes that need it, no need for app.use() here
Router.post("/addProduct", IsSignedIn, isAdmin, ExpressFormidable(), addProduct);
Router.get("/getAllProduct", IsSignedIn, isAdmin, ExpressFormidable(), getAllProduct);
Router.get("/getSingleProduct/:id", IsSignedIn, isAdmin, ExpressFormidable(), getSingleProduct);
Router.delete("/deleteProduct/:id", IsSignedIn, isAdmin, ExpressFormidable(), deleteProduct);
Router.put("/updateProduct/:id", ExpressFormidable(), updateProduct);
// Router.put("/updateProduct/:id", IsSignedIn, isAdmin, ExpressFormidable(), updateProduct);

export default Router;
