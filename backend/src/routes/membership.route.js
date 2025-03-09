import mongoose from "mongoose";
import express from "express";
import { isAdmin, IsSignedIn } from "../middleware/auth.midlleWear.js";
import { CreateMembershipController, deleteMembership, getAllMembership, joinMembership, singleMembership, updateMembership } from "../controllers/membership.controller.js";
import { completePayment, InitializeEsewa } from "../controllers/membershipPayment.controller.js";
const Router = express.Router();

Router.post("/CreateMembership",IsSignedIn,isAdmin,CreateMembershipController)
Router.get("/getAllMembership",getAllMembership);
Router.put("/updateMembership/:_id",IsSignedIn,isAdmin,updateMembership);
Router.delete("/deleteMembership/:_id",IsSignedIn,isAdmin,deleteMembership);
Router.get("/singleMembership/:_id",IsSignedIn,singleMembership);

Router.post("/joinMembership/:_id",IsSignedIn,joinMembership)
Router.post("/joinMembership/Payment/initialize-esewa",IsSignedIn,InitializeEsewa)
Router.get("/joinMembership/Payment/complete-payment/:id",completePayment)

// Router.post("/joinMembership/:_id",IsSignedIn,joinMembership)


export default Router;