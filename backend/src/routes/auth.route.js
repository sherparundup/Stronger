import express from "express";
import {register,login,test, forgetPassword, resetPassword} from "../controllers/auth.controller.js"
import { isAdmin, isCoach, IsSignedIn } from "../middleware/auth.midlleWear.js";
import { upload } from "../middleware/multter.middleware.js";
const Router=express.Router();

//auth routes
Router.post("/register",upload.single("image"),register)
Router.post("/login",login)

//admin and coach routes
Router.get("/admin",IsSignedIn,isAdmin,test)
Router.get("/coach",IsSignedIn,isCoach,test)
Router.post("/forget-password",forgetPassword)
Router.post('/reset-password/:token', resetPassword);  // this route will handle the reset process

//protected routes
Router.get("/user-auth",IsSignedIn,(req,res)=>{
    res.status(200).json({ok:true})
})
Router.get("/admin-auth",IsSignedIn,isAdmin,(req,res)=>{
    res.status(200).json({ok:true})
})
Router.get("/coach-auth",IsSignedIn,isCoach,(req,res)=>{
    res.status(200).json({ok:true})
})











export default Router;