import mongoose from "mongoose";
import express from "express";
import { isAdmin, IsSignedIn } from "../middleware/auth.midlleWear.js";
import { CreateMembershipController, deleteMembership, getAllMembership, joinMembership, singleMembership, updateMembership } from "../controllers/membership.controller.js";
const Router = express.Router();

Router.post("/CreateMembership",IsSignedIn,isAdmin,CreateMembershipController)
Router.post("/joinMembership/:_id",IsSignedIn,joinMembership)
Router.get("/getAllMembership",IsSignedIn,isAdmin,getAllMembership);
Router.put("/updateMembership/:_id",IsSignedIn,isAdmin,updateMembership);
Router.delete("/deleteMembership/:_id",IsSignedIn,isAdmin,deleteMembership);
Router.get("/singleMembership/:_id",IsSignedIn,isAdmin,singleMembership);



export default Router;