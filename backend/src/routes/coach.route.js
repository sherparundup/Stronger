import express from "express"
import { checkVerification, getcheckVerification, VerifyYourSelf, ViewCoaches } from "../controllers/coach.controller.js";
import { upload } from "../middleware/multter.middleware.js";
import { isAdmin, isCoach, IsSignedIn } from "../middleware/auth.midlleWear.js";

const router=express.Router();
//coach
 router.post("/verifyYourSelf",IsSignedIn, upload.single('document'),VerifyYourSelf)

 //admin
 router.get("/viewCoaches",ViewCoaches)
 router.post("/verifyCoach/:id",IsSignedIn,isAdmin,checkVerification)
 router.get("/verifyCoach",IsSignedIn,isAdmin,getcheckVerification)

 export default router;