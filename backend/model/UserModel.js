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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const userModel = mongoose.model("User", UserSchema);
