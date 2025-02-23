import userTestimonialModel from "../model/testimonial.model.js"
import { ApiResponse } from "../utils/util.api.response.js"

export const addTestomonial=async(req,res)=>{
    try {
        const { _id } = req.user;
        const {rating,message,productId}=req.body
        const UserTestimonial=await userTestimonialModel.create({
            rating,
            message,
            productId,
            user:_id
            
        })
        if(!UserTestimonial){
            return res.status(500).json(new ApiResponse(500,{},"No such testimonial found"))
        }
        return res.status(200).json(new ApiResponse(200,UserTestimonial,"Testimonial added"))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500,error.message,"Internal server error"))
    }
}
export const deleteTestimonial=async(req,res)=>{
try {
    const {_id}=req.param
    const TestimonialToBeDeleted=await userTestimonialModel.findByIdAndDelete(_id)
    if(!TestimonialToBeDeleted){
        return res.status(404).json(new ApiResponse(404,{},"No such testimonial found"))
    }
    return res.status(200).json(new ApiResponse(200,{},"Testimonial deleted"))
} catch (error) {
    return res.status(500).json(new ApiResponse(500,error.message,"Internal server error"))
    
}
}
export const getTestomonialById=async(req,res)=>{


}
export const getAllTestomonials=async(req,res)=>{
    

}
export const UpdateUserTestomonial=async(req,res)=>{

}