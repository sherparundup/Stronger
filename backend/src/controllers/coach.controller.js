import CoachVerificationModel from "../model/CoachVerification.model.js";
import { userModel } from "../model/user.model.js";
import { ApiResponse } from "../utils/util.api.response.js";
import {
  uploadOnCloudinary,
  uploadOnCloudinaryPDF,
} from "../utils/cloudinary.util.js";
import CoachBookingModel from "../model/CoachBooking.model.js";
import coachTestimonialModel from "../model/coachTestimonial.model.js";

export const VerifyYourSelf = async (req, res) => {
  try {
    const {
      user,
      name,
      email,
      phone,
      bio,
      category,
      pricePerSession,
      instagram,
    } = req.body;
    const document = req.file;

    // Check if the required fields are present
    if (!document) {
      return res
        .status(400)
        .json(new ApiResponse(400, "", "Document file is required"));
    }

    if (!category || !pricePerSession) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "",
            "Category and Price Per Session are required"
          )
        );
    }

    const checkUser = await userModel.findById(user);
    if (!checkUser) {
      return res.status(404).json(new ApiResponse(404, "", "No such user"));
    }

    // Check if the coach has a previous verification request and if it was rejected
    const existingVerification = await CoachVerificationModel.findOne({
      email,
    });

    if (existingVerification) {
      // If the previous request was rejected, you can either delete it or update it
      if (existingVerification.status === "rejected") {
        // Option 1: Delete previous rejection and create a new verification
        await CoachVerificationModel.deleteOne({ email }); // Delete previous rejection
      } else {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              "",
              "You have already submitted a verification request"
            )
          );
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
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Document upload failed."));
      }
      verification.document.url = uploadDocument.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error.message,
            "Document upload to Cloudinary failed."
          )
        );
    }

    await verification.save();

    res
      .status(201)
      .json(new ApiResponse(201, verification, "Verification sent"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const ViewCoaches = async (req, res) => {
  try {
    const approvedCoaches = await CoachVerificationModel.find({
      status: "approved",
    }).populate("user");
    res
      .status(200)
      .json(new ApiResponse(200, approvedCoaches, "approved coaches"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const isVerified = async (req, res) => {
  try {
    const { id } = req.params;
    const coachIsVerified = await CoachVerificationModel.findOne({
      user: id,
      status: "approved",
    });
    if (!coachIsVerified) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, { verified: false }, "no such coach is verified")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { verified: true }, "Coach is verified"));
  } catch (error) {
    return res
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
          `Coach has been ${verified ? "verified" : "rejected"} successfully`
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const getcheckVerification = async (req, res) => {
  try {
    const toVerify = await CoachVerificationModel.find({
      status: "pending",
    }).populate("user");
    return res
      .status(200)
      .json(new ApiResponse(200, toVerify, "verification for coaches"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const SpecifiedCoach = async (req, res) => {
  try {
    const { coachId } = req.params;
    console.log("id iiiss", coachId);
    const TheSpecifiedCoach = await CoachVerificationModel.findById(
      coachId
    ).populate("user");
    if (!TheSpecifiedCoach) {
      return res.status(404).json(new ApiResponse(404, {}, "No coach found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, TheSpecifiedCoach, "SpecifiedCoach data fetched")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};


export const HiringCoach = async (req, res) => {
  try {
    const { coachId, userId, selectedDate } = req.body;

    // Convert selectedDate to a Date object
    const selectedDateObj = new Date(selectedDate);

    // Check if the selected date is in the past
    if (selectedDateObj < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot hire a coach for a past date.",
      });
    }

    // Check if the coach is already booked on that date
    const isBooked = await CoachBookingModel.findOne({
      coachId,
      selectedDate: {
        $gte: new Date(new Date(selectedDate).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(selectedDate).setHours(23, 59, 59, 999)),
      },
    });

    if (isBooked) {
      return res.status(400).json({
        success: false,
        message: "Coach is unavailable on the selected date.",
      });
    }

    // Create a new hiring record
    const hiringData = new CoachBookingModel({
      coachId,
      userId,
      selectedDate,
    });

    await hiringData.save();

    res.status(201).json({
      success: true,
      message: "Coach hired successfully!",
      data: hiringData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while hiring the coach",
      error: error.message,
    });
  }
};




export const getAllClients = async (req, res) => {
  try {
    const {CoachId}=req.params;

    const clients = await CoachBookingModel.find({coachId:CoachId}).populate("userId")
    res.status(200).json({
      success: true,
      message: "Fetched all clients successfully",
       clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};
export const coachForContext = async (req, res) => {
  try {
    const { coachId } = req.params;
    console.log("id iiiss", coachId);
    const TheSpecifiedCoach = await CoachVerificationModel.findOne(
      {user:coachId}
    ).populate("user");
    if (!TheSpecifiedCoach) {
      return res.status(404).json(new ApiResponse(404, {}, "No coach found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, TheSpecifiedCoach, "SpecifiedCoach data fetched")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

export const acceptClients = async (req, res) => {
  try {
    const { clientId, coachId, status, selectedDate } = req.body;

    const updatedBooking = await CoachBookingModel.findOneAndUpdate(
      {
        userId: clientId,
        coachId: coachId,
        selectedDate: selectedDate,
      },
      { status: status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: `Client has been ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating client booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const CoachTestimonial = async (req, res) => {
  try {
    // Destructure the required data from the request body
    const { coachId, userId, rating, message } = req.body;

    // Validate the input data
    if (!coachId || !userId || !rating || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Ensure the rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    // Find the coach by the coachId
    const coach = await CoachVerificationModel.findById(coachId);
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found.' });
    }

    const testimonial = new coachTestimonialModel({
      coach: coachId,
      user: userId,
      rating,
      message,
    });

    // Save the testimonial to the database
    await testimonial.save();

    // Respond with the saved testimonial
    res.status(201).json({
      message: 'Testimonial submitted successfully.',
      testimonial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while submitting the testimonial.' });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const { coachId } = req.params; // Extract coachId from the request params

    // Fetch all testimonials for the specified coachId
    const testimonials = await coachTestimonialModel.find({ coach:coachId })
      .populate("user", "name image") // Populating user data (if necessary)
      .sort({ createdAt: -1 }); // Sorting by creation date, latest first

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No testimonials found for this coach.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonials fetched successfully.",
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching testimonials.",
      error: error.message,
    });
  }
};

export const hasUserHadSession = async (req, res) => {
  try {
    const { coachId, userId } = req.body;

    if (!coachId || !userId) {
      return res.status(400).json({ success: false, message: "coachId and userId are required." });
    }

    const sessionExists = await CoachBookingModel.find({
      coach: coachId,
      user: userId,
      status: "approved" 
    });

    if (sessionExists) {
      return res.status(200).json({
        success: true,
        hasSession: true,
        message: "User has had at least one session with the coach."
      });
    } else {
      return res.status(200).json({
        success: true,
        hasSession: false,
        message: "User has not had any sessions with the coach."
      });
    }
  } catch (error) {
    console.error("Error checking session:", error);
    return res.status(500).json({
      success: false,
      message: "Server error checking session.",
      error: error.message,
    });
  }
};