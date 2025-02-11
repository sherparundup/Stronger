import express from "express";
import { getAllUser, getUserByName } from "../controllers/user.controller.js";
import { isAdmin, IsSignedIn } from '../middleware/auth.midlleWear.js';

const Router=express.Router();

Router.get("/AllUser",IsSignedIn,isAdmin,getAllUser)
Router.get("/UserByName",IsSignedIn,isAdmin,getUserByName)


export default Router;