import express from "express";
import { userModel } from "../model/UserModel.js";
import { ComparePassword, HashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the email is already in use
        const isThereThisEmailAlready = await userModel.findOne({ email });
        if (isThereThisEmailAlready) {
            return res.status(400).json({
                success: false,
                message: "Already a user with this email"
            });
        }

        // Hash the password and create a new user
        const HashedPassword = await HashPassword(password);
        const newUser = new userModel({ name, email, password: HashedPassword, role });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists with the provided email
        const isThereAUserWithThisEmail = await userModel.findOne({ email });
        if (!isThereAUserWithThisEmail) {
            return res.status(400).json({
                success: false,
                message: "No user with this email"
            });
        }

        // Verify the provided password
        const doesThePassWordMatch = await ComparePassword(password, isThereAUserWithThisEmail.password);
        if (!doesThePassWordMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            });
        }

        // Generate JWT token
        const token = JWT.sign(
            { _id: isThereAUserWithThisEmail._id },
            process.env.SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            user: {
                _id: isThereAUserWithThisEmail._id, 
                name: isThereAUserWithThisEmail.name, 
                email: isThereAUserWithThisEmail.email,
                role: isThereAUserWithThisEmail.role
            },
            token
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const test = (req, res) => {
    res.send("hello world");
};
