import ProductModel from "../model/product.model.js";
import fs from "fs";
import { ApiResponse } from "../utils/util.api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import AddToCartModel from "../model/addToCart.model.js";
import Payment from "../model/payment.model.js";
import PurchasedProduct from "../model/purchasedProduct.model.js";
import mongoose from "mongoose";
import purchasedProduct from "../model/purchasedProduct.model.js";
// import purchasedProduct from "../model/purchasedProduct.model.js";
// Add a new product

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, catagory } = req.body;
    const image = req.file; // File data will be in req.files

    // Validate required fields
    if (!name || !price || !countInStock) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if the product already exists
    const isThereSameProduct = await ProductModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (isThereSameProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product already exists" });
    }

    // Initialize the product object
    const newProduct = new ProductModel({
      name,
      description,
      price,
      countInStock,
      catagory,
    });

    // Handle image if provided
    if (image) {
      const imagePath = image.path;
      try {
        const uploadimage = await uploadOnCloudinary(imagePath);
        if (!uploadimage) {
          return res
            .status(400)
            .json(new ApiResponse(400, {}, "Image upload failed."));
        }
        newProduct.image.url = uploadimage.secure_url;
        await newProduct.save();
      } catch (error) {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              error.message,
              "Image upload to Cloudinary failed."
            )
          );
      }
    }

    // Save the product
    await newProduct.save();
    return res.status(200).json({
      success: true,
      message: `Product added successfully`,
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all products
export const getAllProduct = async (req, res) => {
  try {
    const allProduct = await ProductModel.find();
    return res
      .status(200)
      .json({
        success: true,
        message: "All products retrieved successfully",
        products: allProduct,
      });
  } catch (error) {
    console.error("Error in getAllProduct:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Get a single product
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProduct = await ProductModel.findById(id);

    if (!singleProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Product retrieved successfully",
        product: singleProduct,
      });
  } catch (error) {
    console.error("Error in getSingleProduct:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isThereProduct = await ProductModel.findById(id);

    if (!isThereProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await ProductModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, catagory } = req.body;
    const image = req.file; // Extract image file
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Product name is required" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, message: "Product description is required" });
    if (!price)
      return res
        .status(400)
        .json({ success: false, message: "Product price is required" });
    if (!countInStock)
      return res
        .status(400)
        .json({
          success: false,
          message: "Product count in stock is required",
        });
    if (!catagory)
      return res
        .status(400)
        .json({ success: false, message: "Product category is required" });

    // Check if product exists
    const isThereProduct = await ProductModel.findById(id);
    if (!isThereProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Handle Image Upload
    let uploadedImage = isThereProduct.image; // Keep old image if no new image is provided
    if (image) {
      const upload = await uploadOnCloudinary(image.path);
      if (!upload) {
        return res
          .status(400)
          .json({ success: false, message: "Image upload failed" });
      }
      uploadedImage = { url: upload.secure_url };
    }

    // Update product after handling image
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        countInStock,
        catagory,
        image: uploadedImage,
      },
      { new: true }
    );

    await updatedProduct.save(); // Save after update

    return res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const { _id } = req.user;

    const productToBeAdded = await ProductModel.findById(product._id);
    if (!productToBeAdded) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Product not found"));
    }
    const AddToCart = await AddToCartModel.create({
      UserId: _id,
      ProductId: product._id,
      quantity,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, AddToCart, "product added to cart"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "something went wrong"));
  }
};

export const getCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const UsersCart = await AddToCartModel.find({UserId:_id}).populate("ProductId");
    
    return res.status(200).json(new ApiResponse(200, UsersCart, "Cart found"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "something went wrong"));
  }
};

export const removeCart=async(req,res)=>{
    try {
        const {id}=req.params;
        
        const cartToBeDeleted=await AddToCartModel.findByIdAndDelete(id);
        if(!res){
            return res.status(404)
              .json(new ApiResponse(404,{}, "No cart withthis id"));
            }
            return res
              .status(200)
              .json(new ApiResponse(200,{}, "removed Cart"));
        

        
        
    } catch (error) {
        console.log(error)
        return res
          .status(500)
          .json(new ApiResponse(500, error.message, "something went wrong"));
        }
        
    }

  export const getUserProduct=async(req,res)=>{
    try {
      const {id}=req.params;
      if(!id){
        return res.status(404).json(new ApiResponse(404,{},"no User"))
      }
      const BoughtProducts=await PurchasedProduct.find({UserId:id,status:"completed"}).populate("product")
      return res.status(200).json(new ApiResponse(200,BoughtProducts,"Products"))
      
    } catch (error) {
      return res.status(500).json(new ApiResponse(500,error.message,"okkk"))
      
    }
    
  }
  
  export const checkIfUserBoughtTheProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid User ID"));
      }
      
      const purchasedProduct = await PurchasedProduct.findOne({
        product:id,
        status: "completed",
        UserId:req.user._id
      });
  
      if (!purchasedProduct) {
        return res.status(404).json(new ApiResponse(404, null, "User has not bought this product"));
      }
  
      return res.status(200).json(new ApiResponse(200, purchasedProduct, "User has bought this product"));
      
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, "Internal server error"));
    }
  };
  
  export const BoughtProduct=async(req,res)=>{
    
    try {
      const allBoughtProduct=await PurchasedProduct.find({
        status:"completed"

      })
      return res.status(200).json(new ApiResponse(200,allBoughtProduct,"all products"))
      
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, "Internal server error"));
      
    }
  }