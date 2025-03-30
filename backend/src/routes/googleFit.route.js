import express from "express"
import {googleFit, googleSteps, url} from "../controllers/googleFit.controller.js"
import { isThereGoogleFitToken } from "../middleware/googleFit.middleWear.js"

const Router = express.Router()
Router.get("",url)
Router.get("/get-token",googleFit)
// Router.get("/steps",googleSteps)
Router.get("/steps",isThereGoogleFitToken,googleSteps)
export default Router