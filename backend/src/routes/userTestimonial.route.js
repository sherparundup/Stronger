import express from "express";
import { addTestomonial, avgTestimonial, deleteTestimonial,getAllTestomonials,getTestomonialById,UpdateUserTestomonial } from "../controllers/userTestimonial.controller.js";
import { IsSignedIn } from "../middleware/auth.midlleWear.js";

const router = express.Router();  


router.post("/addTestomonial",IsSignedIn, addTestomonial);
router.delete("/deleteTestomonial/:id", deleteTestimonial);
router.get("/getAllTestomonial", getAllTestomonials);
router.get("/getTestomonialById/:id", getTestomonialById);
router.put("/updateTestomonial/:id", UpdateUserTestomonial);
router.get("/AvgTestimonial/:id", avgTestimonial);


export default router;