import CoachVerificationModel from "../model/CoachVerification.model.js";
import { userModel } from "../model/user.model.js";
import { ApiResponse } from "../utils/util.api.response.js";
import { uploadOnCloudinary, uploadOnCloudinaryPDF } from "../utils/cloudinary.util.js";



export const VerifyYourSelf = async (req, res) => {
  try {
    const { user, name, email, phone, bio, category, pricePerSession, instagram } = req.body;
    const document = req.file;

    // Check if the required fields are present
    if (!document) {
      return res.status(400).json(new ApiResponse(400, "", "Document file is required"));
    }

    if (!category || !pricePerSession) {
      return res.status(400).json(new ApiResponse(400, "", "Category and Price Per Session are required"));
    }

    const checkUser = await userModel.findById(user);
    if (!checkUser) {
      return res.status(404).json(new ApiResponse(404, "", "No such user"));
    }

    // Check if the coach has a previous verification request and if it was rejected
    const existingVerification = await CoachVerificationModel.findOne({ email });

    if (existingVerification) {
      // If the previous request was rejected, you can either delete it or update it
      if (existingVerification.status === 'rejected') {
        // Option 1: Delete previous rejection and create a new verification
        await CoachVerificationModel.deleteOne({ email }); // Delete previous rejection
      } else {
        return res.status(400).json(new ApiResponse(400, "", "You have already submitted a verification request"));
      }
    }

    // Proceed to create the new verification request
    const verification = new CoachVerificationModel({
      user,
      name,
      email,
      phone,
      bio,
      category,
      pricePerSession,
      instagram,
  
    });

    const documentPath = document.path;
    try {
      const uploadDocument = await uploadOnCloudinaryPDF(documentPath);
      if (!uploadDocument) {
        return res.status(400).json(new ApiResponse(400, {}, "Document upload failed."));
      }
      verification.document.url = uploadDocument.secure_url;
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, "Document upload to Cloudinary failed."));
    }

    await verification.save();

    res.status(201).json(new ApiResponse(201, verification, "Verification sent"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};



export const ViewCoaches = async (req, res) => {
  try {
    const approvedCoaches = await CoachVerificationModel.find({
      status: "approved",
    });
    res
      .status(200)
      .json(new ApiResponse(200, approvedCoaches, "approved coaches"));
    } catch (error) {
      res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
    }
  };
  
  export const checkVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body; // expecting true or false
    
    const updatedCoach = await CoachVerificationModel.findByIdAndUpdate(
      id,
      { status: verified },
      { new: true } // return the updated document
    );

    if (!updatedCoach) {
      return res
      .status(404)
        .json(new ApiResponse(404, null, "Coach not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCoach,
          `Coach has been ${
            verified ? "verified" : "rejected"
          } successfully`
        )
      );
  } catch (error) {
    res
    .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const getcheckVerification = async (req,res) => {
  try {
    const toVerify= await CoachVerificationModel.find({status:"pending"}).populate("user")
    res
    .status(200)
    .json(new ApiResponse(200, toVerify, "verification for coaches"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
    }

};
