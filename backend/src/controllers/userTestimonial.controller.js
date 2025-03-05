import userTestimonialModel from "../model/testimonial.model.js";
import UserTestimonialModel from "../model/testimonial.model.js"
import { ApiResponse } from "../utils/util.api.response.js"

export const addTestomonial=async(req,res)=>{
    try {
        const { _id } = req.user;
        const {rating,message,productId}=req.body
        const UserTestimonial=await UserTestimonialModel.create({
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
    const TestimonialToBeDeleted=await UserTestimonialModel.findByIdAndDelete(_id)
    if(!TestimonialToBeDeleted){
        return res.status(404).json(new ApiResponse(404,{},"No such testimonial found"))
    }
    return res.status(200).json(new ApiResponse(200,{},"Testimonial deleted"))
} catch (error) {
    return res.status(500).json(new ApiResponse(500,error.message,"Internal server error"))
    
}
}
export const getTestomonialById=async(req,res)=>{
    try {
        const {id}=req.params

        const testimonials =await UserTestimonialModel.find({productId:id}).populate("user").populate("productId")

        return res.status(200).json(new ApiResponse(200,testimonials,"testimonial"))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500,error,"something went wrong"))
        
    }


}
export const getAllTestomonials=async(req,res)=>{
    try {
        const testimonials =await UserTestimonialModel.find().populate("user").populate("productId")

        return res.status(200).json(new ApiResponse(200,testimonials,"testimonial"))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500,error,"something went wrong"))
        
    }
    
    
}
export const UpdateUserTestomonial=async(req,res)=>{
    
}
export const avgTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const productTestimonials = await userTestimonialModel.find({ productId: id });
        if(!productTestimonials){
            return res.status(500).json(new ApiResponse(500,{},"something went wrong"))

        }

        if (productTestimonials.length === 0) {
            return res.status(200).json({ averageRating: 0, message: "No ratings yet" });
        }

        const totalRating = productTestimonials.reduce((sum, t) => sum + t.rating, 0);
        const averageRating = totalRating / productTestimonials.length;
        
        // Send response
        return res.status(200).json(new ApiResponse(200,averageRating,"avg rating recieved"));
        // return res.status(200).json({ averageRating, count: productTestimonials.length });
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,error,"something went wrong"))
    }
};
