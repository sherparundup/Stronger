import mongoose from "mongoose";

// Define the schema for the user
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'coach', 'user'],
        default: 'user', // Default role
    },
    image:{
        url:{
            type:String,
            required: true
        }
    },
    contactNumber: {  // <-- This is the number field
        type: Number,
        required: true
    },
    isMember:{
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String, // Token for password reset
        default: null, // Default value is null
    },
    resetTokenExpiry: {
        type: Date, // Expiry date for the reset token
        default: null, // Default value is null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
export const userModel = mongoose.model("User", UserSchema);
