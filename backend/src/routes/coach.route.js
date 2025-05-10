import express from "express";
import {
  acceptClients,
  checkVerification,
  coachForContext,
  CoachTestimonial,
  CreateCoachingPlan,
  getAllClients,
  getAllTestimonials,
  getcheckVerification,
  getCoachingPlans,
  hasUserHadSession,
  HiringCoach,
  isVerified,
  plansRevenue,
  SpecifiedCoach,
  VerifyYourSelf,
  ViewCoaches,
} from "../controllers/coach.controller.js";
import { upload } from "../middleware/multter.middleware.js";
import { isAdmin, isCoach, IsSignedIn } from "../middleware/auth.midlleWear.js";

const router = express.Router();
//coach
router.post(
  "/verifyYourSelf",
  IsSignedIn,
  upload.single("document"),
  VerifyYourSelf
);

//admin
router.get("/viewCoaches", ViewCoaches);
router.get("/SpecifiedCoach/:coachId", SpecifiedCoach);
router.get("/isVerified/:id", isVerified);
router.post("/verifyCoach/:id", IsSignedIn, isAdmin, checkVerification);
router.get("/verifyCoach", IsSignedIn, isAdmin, getcheckVerification);

router.post("/hireCoach", IsSignedIn, HiringCoach);
router.get("/getAllClients/:CoachId", IsSignedIn, getAllClients);
router.put("/acceptClients/:UserId", IsSignedIn, acceptClients);
router.get("/coachForContext/:coachId", coachForContext);

router.post("/coachTestimonial", CoachTestimonial);
router.get("/testimonials/:coachId", getAllTestimonials);
router.post("/checkIfSession", hasUserHadSession);

router.post(
  "/createCoachingPlan/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  CreateCoachingPlan
);
router.get("/getCoachingPlans/:id", getCoachingPlans);

router.get("/plansRevenue/:id",plansRevenue)

export default router;
