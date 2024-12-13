import express from "express";
import {register,login,test} from "../controller/AuthController.js"
import { isAdmin, isCoach, IsSignedIn } from "../middleware/AuthMidlleWear.js";
const Router=express.Router();

//auth routes
Router.post("/register",register)
Router.post("/login",login)

//admin routes
Router.get("/admin",IsSignedIn,isAdmin,test)
Router.get("/coach",IsSignedIn,isCoach,test)








export default Router;