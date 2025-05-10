import JWT from "jsonwebtoken";
import { userModel } from "../model/user.model.js";

export const IsSignedIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Log in first" });
        }
        
        const decode = JWT.verify(token, process.env.SECRET);
        req.user = decode; // Attach decoded data to the request
        next();
    } catch (error) {
        return res.status(400).json({success:false, message: "Invalid or missing JWT", error: error.message });
    }
};
export const isAdmin = async (req, res, next) => {
    try {
        const admin = await userModel.findById(req.user?._id);
        if (admin?.role !== "admin") {
            return res.status(401).json({ success: false, message: "not authorised" })
            
        }
        next();
        
        
    } catch (error) {
        return res.status(400).json({success:false, message: "Your not admin", error: error.message });
        
    }
    
    
}
export const isCoach = async (req, res, next) => {
    try {
        const coach = await userModel.findById(req.user?._id);
        if (coach?.role !== coach) {
            return res.status(401).json({ success: false, message: "your not a coach" })
            
        }
        next();
        
    } catch (error) {
        return res.status(400).json({success:false, message: "Your not coach", error: error.message });
        
    }

}