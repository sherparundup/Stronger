import express from "express"
import {completePayment, InitializeEsewa} from "../controllers/payment.controller.js" 
import { IsSignedIn } from "../middleware/auth.midlleWear.js";
const Router=express.Router();

Router.post("/initialize-esewa",IsSignedIn,InitializeEsewa)
Router.get("/complete-payment",completePayment)

export default Router