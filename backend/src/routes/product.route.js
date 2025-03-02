import express from 'express';
import { addProduct, addToCart, deleteProduct, getAllProduct, getCart, getSingleProduct, getUserProduct, removeCart, updateProduct } from '../controllers/product.controller.js';
import ExpressFormidable from 'express-formidable';
import { isAdmin, IsSignedIn } from '../middleware/auth.midlleWear.js';
import { upload } from "../middleware/multter.middleware.js";

const Router = express.Router();

Router.post("/addProduct", IsSignedIn, isAdmin,upload.single("image"), addProduct);
Router.get("/getAllProduct",  getAllProduct);
Router.get("/getSingleProduct/:id",getSingleProduct);
Router.delete("/deleteProduct/:id", IsSignedIn, isAdmin, deleteProduct);
Router.put("/updateProduct/:id",upload.single("image") , updateProduct);
//user
Router.post("/addToCart", IsSignedIn, addToCart);
Router.get("/getCart", IsSignedIn, getCart);
Router.delete("/removeCart/:id", IsSignedIn, removeCart);
Router.get("/getUserProduct/:id", IsSignedIn, getUserProduct);
    
export default Router;
