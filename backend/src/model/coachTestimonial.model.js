import mongoose from "mongoose";

const coachTestimonialSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
    required: true,
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoachVerification",
    required: [true, "coach is required"],
  },

  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
  },
  message: {
    type: String,
  },
}, {
  timestamps: true,
});

const coachTestimonialModel = mongoose.model(
  "coachTestimonial",
  coachTestimonialSchema
);

export default coachTestimonialModel;
