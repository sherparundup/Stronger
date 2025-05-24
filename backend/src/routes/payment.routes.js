import express from "express"
import {CompleteBulkPayment, completePayment, completePaymentForCoachPlan, InitializeBulkEsewa, InitializeEsewa, InitializeEsewaForCoachPlan} from "../controllers/payment.controller.js" 
import { IsSignedIn } from "../middleware/auth.midlleWear.js";
const Router=express.Router();

Router.post("/initialize-esewa",IsSignedIn,InitializeEsewa)
Router.get("/complete-payment/:id", completePayment);
Router.post("/initialize-bulk-esewa",IsSignedIn,InitializeBulkEsewa)
Router.get("/complete-bulk-payment/:id", CompleteBulkPayment);
// Router.get("/complete-payment", completePayment);
Router.post("/InitializeEsewaForCoachPlan",IsSignedIn,InitializeEsewaForCoachPlan)
Router.get("/completePaymentForCoachPlan/:id", completePaymentForCoachPlan);

export default Router