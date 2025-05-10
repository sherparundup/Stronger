import express from "express"
import {completePayment, completePaymentForCoachPlan, InitializeEsewa, InitializeEsewaForCoachPlan} from "../controllers/payment.controller.js" 
import { IsSignedIn } from "../middleware/auth.midlleWear.js";
const Router=express.Router();

Router.post("/initialize-esewa",IsSignedIn,InitializeEsewa)
Router.get("/complete-payment/:id", completePayment);
// Router.get("/complete-payment", completePayment);
Router.post("/InitializeEsewaForCoachPlan",IsSignedIn,InitializeEsewaForCoachPlan)
Router.get("/completePaymentForCoachPlan/:id", completePaymentForCoachPlan);

export default Router