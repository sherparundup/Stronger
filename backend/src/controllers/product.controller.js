import productModel from "../model/product.model.js";
import fs from "fs";
import {ApiResponse} from "../utils/util.api.response.js"
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

// Add a new product

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock, catagory } = req.body;
        const  image  = req.file;  // File data will be in req.files

        // Validate required fields
        if (!name || !price || !countInStock) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if the product already exists
        const isThereSameProduct = await productModel.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        });
        if (isThereSameProduct) {
            return res.status(400).json({ success: false, message: "Product already exists" });
        }

        // Initialize the product object
        const newProduct = new productModel({
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
                .json(new ApiResponse(500, error.message, "Image upload to Cloudinary failed."));
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
        const allProduct = await productModel.find();
        return res.status(200).json({ success: true, message: "All products retrieved successfully", products: allProduct });
    } catch (error) {
        console.error("Error in getAllProduct:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get a single product
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await productModel.findById(id);

        if (!singleProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, message: "Product retrieved successfully", product: singleProduct });

    } catch (error) {
        console.error("Error in getSingleProduct:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const isThereProduct = await productModel.findById(id);

        if (!isThereProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await productModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error in deleteProduct:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock, catagory } = req.fields;
        const { image } = req.files;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }
        if (!name) {
            return res.status(400).json({ success: false, message: "Product name is required" });
        }
        if (!description) {
            return res.status(400).json({ success: false, message: "Product description is required" });
        }
        if (!price) {
            return res.status(400).json({ success: false, message: "Product price is required" });
        }
        if (!countInStock) {
            return res.status(400).json({ success: false, message: "Product count in stock is required" });
        }
        if (!catagory) {
            return res.status(400).json({ success: false, message: "Product category is required" });
        }

        const isThereProduct = await productModel.findById(id);
        if (!isThereProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updateProduct = await productModel.findByIdAndUpdate(id, {
            name,
            description,
            price,
            countInStock,
            image,
            catagory,
        }, { new: true });
        if (image) {
            updateProduct.image = {

                data: fs.readFileSync(image.path),
                contentType: image.type,
            }
        }
        await updateProduct.save();
        console.log("Received params:", req.params);


        return res.status(200).json({ success: true, message: "Product updated successfully", product: updateProduct });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};