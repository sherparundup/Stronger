import mongoose from "mongoose";
import express from "express";
import { isAdmin, IsSignedIn } from "../middleware/AuthMidlleWear.js";
import { CreateMembershipController, joinMembership } from "../controller/MembershipController.js";
const Router = express.Router();

Router.post("/CreateMembership",IsSignedIn,isAdmin,CreateMembershipController)
Router.post("/joinMembership/:_id",IsSignedIn,joinMembership)



export default Router;