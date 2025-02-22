import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from '../controllers/product.controller.js';
import ExpressFormidable from 'express-formidable';
import { isAdmin, IsSignedIn } from '../middleware/auth.midlleWear.js';
import { upload } from "../middleware/multter.middleware.js";

const Router = express.Router();

// Use ExpressFormidable in the routes that need it, no need for app.use() here
Router.post("/addProduct", IsSignedIn, isAdmin,upload.single("image"), addProduct);
Router.get("/getAllProduct",  getAllProduct);
Router.get("/getSingleProduct/:id",getSingleProduct);
Router.delete("/deleteProduct/:id", IsSignedIn, isAdmin, deleteProduct);
Router.put("/updateProduct/:id",upload.single("image") , updateProduct);
// Router.put("/updateProduct/:id", IsSignedIn, isAdmin, ExpressFormidable(), updateProduct);

export default Router;
