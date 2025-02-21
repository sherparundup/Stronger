import mongoose from "mongoose";
const purchasedProductScheme = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    quantity:{
      type:Number,
      required:true
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
const purchasedProduct=mongoose.model("purchasedProduct",purchasedProductScheme)


export default purchasedProduct;