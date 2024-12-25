import { userModel } from "../model/UserModel.js";

export const getAllUser=async(req,res)=>{
    try {
        const allUser=await userModel.find();
        const count=allUser.length;
        return res.status(200).json({success:true,allUser,count:count});
    } catch (error) {
        
        return res.status(500).json({success:false,error:error.message});
    }


}