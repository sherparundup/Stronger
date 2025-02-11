import { userModel } from "../model/user.model.js";

export const getAllUser=async(req,res)=>{
    try {
        const allUser=await userModel.find();
        const count=allUser.length;
        return res.status(200).json({success:true,allUser,count:count});
    } catch (error) {
        
        return res.status(500).json({success:false,error:error.message});
    }


}
export const getUserByName=async(req,res)=>{
    try {
        const{name}=req.body;
        if(!name){
            return res.status(400).json({success:false,message:"Name is required"});
        }
        const user=await userModel.findOne({name});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({success:true,name:name,userFiltered:user});
        
    } catch (error) {
        return res.status(500).json({success:false,error:error.message});
        
    }
}