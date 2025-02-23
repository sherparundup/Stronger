import mongoose from "mongoose";

const addToCartSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },
  quantity: {   
    type: Number,
    required: true,
  },
});

const AddToCartModel = mongoose.model("AddToCart", addToCartSchema);

export default AddToCartModel;
