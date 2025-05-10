import mongoose from "mongoose";
const purchasedCoachPlansScheme = mongoose.Schema(
  {
    coachPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingPlan",
      require: true,
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachVerification",
      required: [true, "coach is required"],
    },
   
    totalPrice: {
      type: Number,
      required: true,
    },
    purchasedDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
const purchasedCoachPlansModel = mongoose.model(
  "purchasedCoachPlans",
  purchasedCoachPlansScheme
);

export default purchasedCoachPlansModel;
