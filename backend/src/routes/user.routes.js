import express from "express";
import { createTransformation, deleteTransformation, getAllTransformations, getAllUser, getTransformationById, getUserByName } from "../controllers/user.controller.js";
import { isAdmin, IsSignedIn } from '../middleware/auth.midlleWear.js';
import { upload } from "../middleware/multter.middleware.js";

const Router=express.Router();

Router.get("/AllUser",IsSignedIn,isAdmin,getAllUser)
Router.get("/UserByName",IsSignedIn,isAdmin,getUserByName)

Router.get('/getAllTransformations', getAllTransformations);

// Get transformation by id
Router.get('/getTransformationById/:id', getTransformationById);

// Create a transformation (requires auth)
Router.post('/createTransformation', upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), createTransformation);

// Delete a transformation (requires auth)
Router.delete('deleteTransformation/:id', deleteTransformation);


export default Router;