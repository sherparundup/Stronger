import mongoose from "mongoose";

const paymentCoachingPlanSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    pidx: { type: String, unique: true },
     coachPlan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CoachingPlan",
          require: true,
        },
    
  
    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object },
    apiQueryFromUser: { type: Object },
    paymentGateway: {
      type: String,
      enum: ["cash", "esewa"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const PaymentpaymentCoachingPlanModel = mongoose.model("paymenttCoachingPlan", paymentCoachingPlanSchema);
export default PaymentpaymentCoachingPlanModel;