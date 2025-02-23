import mongoose from "mongoose";

const userTestimonialSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
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
});

const userTestimonialModel = mongoose.model(
  "UserTestimonial",
  userTestimonialSchema
);

export default userTestimonialModel;
