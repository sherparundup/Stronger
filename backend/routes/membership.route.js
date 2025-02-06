import mongoose from "mongoose";
import express from "express";
import { isAdmin, IsSignedIn } from "../middleware/auth.midlleWear.js";
import { CreateMembershipController, deleteMembership, getAllMembership, joinMembership, updateMembership } from "../controllers/membership.controller.js";
const Router = express.Router();

Router.post("/CreateMembership",IsSignedIn,isAdmin,CreateMembershipController)
Router.post("/joinMembership/:_id",IsSignedIn,joinMembership)
Router.get("/getAllMembership",IsSignedIn,isAdmin,getAllMembership);
Router.put("/updateMembership/:_id",IsSignedIn,isAdmin,updateMembership);
Router.delete("/deleteMembership/:_id",IsSignedIn,isAdmin,deleteMembership);


export default Router;