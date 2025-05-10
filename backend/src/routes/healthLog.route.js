import { Router } from "express";
import { getHealthLogs, logHealthData } from "../controllers/healthLog.controller.js";
import { IsSignedIn } from "../middleware/auth.midlleWear.js";

const router = Router();

router.post("/log", IsSignedIn, logHealthData);
router.get("/log", IsSignedIn, getHealthLogs);

export default router;
