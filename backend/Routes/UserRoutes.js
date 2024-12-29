import express from "express";
import { getAllUser } from "../controller/UserController.js";
import { isAdmin, IsSignedIn } from "../middleware/AuthMidlleWear.js";

const Router=express.Router();

Router.get("/AllUser",IsSignedIn,isAdmin,getAllUser)


export default Router;