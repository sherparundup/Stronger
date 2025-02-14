import express from "express"
import {completePayment, InitializeEsewa} from "../controllers/payment.controller.js" 
const Router=express.Router();

Router.post("/initialize-esewa",InitializeEsewa)
Router.get("/complete-payment",completePayment)

export default Router