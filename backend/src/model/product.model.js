import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        url: {
          type: String,
        },
      },    
    catagory:{
        type: String,
        required: true,

    },
    

},{
    timestamps:true
})
const productModel = mongoose.model("Product", productSchema);
export default productModel;    