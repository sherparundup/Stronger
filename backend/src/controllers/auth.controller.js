import express from "express";
import { userModel } from "../model/user.model.js";
import { ComparePassword, HashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"



export const register = async (req, res) => {
    try {
        const { name, email, password, role, contactNumber } = req.body;

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
        const newUser = new userModel({ name, email, password: HashedPassword, role, contactNumber });
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
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send('No account found with that email');
        }

        // Create a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save the reset token and expiry to the user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send reset link to user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use a service like Gmail or SMTP
            auth: {
                user: 'strongerfyp@gmail.com',
                pass: 'mtnn fnyj cfjb ogkf',
            },
        });

        const resetLink = `${process.env.REACT_APP_FRONTEND_URL}/resetPassword?token=${resetToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            text: `Click on the following link to reset your password: ${resetLink}`,
        });

        res.send({ message: 'Password reset link sent' });
    } catch (err) {
        console.log(`errorrrrrrrrrrr is ${err}`)
        res.status(500).send({ message: 'Server error', error: err.message });
    }


}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        // Find user by token
        const user = await userModel.findOne({ resetToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user with the new password and clear the reset token
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear the token
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({ success: false, message: "Server error.", err: err.message });
    }


}