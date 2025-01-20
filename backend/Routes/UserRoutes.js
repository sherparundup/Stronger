import express from "express";
import { getAllUser, getUserByName } from "../controller/UserController.js";
import { isAdmin, IsSignedIn } from "../middleware/AuthMidlleWear.js";

const Router=express.Router();

Router.get("/AllUser",IsSignedIn,isAdmin,getAllUser)
Router.get("/UserByName",IsSignedIn,isAdmin,getUserByName)


export default Router;