import productModel from "../model/ProductModel.js";
import fs from "fs";

// Add a new product

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, countInStock, catagory } = req.fields;
        const { image } = req.files;  // File data will be in req.files

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
            console.log("Uploaded image file:", image);  // Debugging line to check file data
            
            newProduct.image = {
                data: fs.readFileSync(image.path),  // Reads the image file as binary data
                contentType: image.type,            // Gets the MIME type (e.g., image/jpeg)
            };
        }

        // Save the product
        await newProduct.save();
        return res.status(200).json({
            success: true,
            message: `Product added successfully. Image uploaded: ${image ? image.name : "No image uploaded"}`,
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
        const { _id, name, description, price, countInStock, image, category } = req.body;

        if (!_id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const isThereProduct = await productModel.findById(_id);
        if (!isThereProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updateProduct = await productModel.findByIdAndUpdate(_id, {
            name,
            description,
            price,
            countInStock,
            image,
            category,
        }, { new: true });

        return res.status(200).json({ success: true, message: "Product updated successfully", product: updateProduct });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
