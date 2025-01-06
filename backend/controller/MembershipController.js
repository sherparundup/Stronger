import mongoose from "mongoose";
import { MembershipModel, UserMembershipModel } from '../model/MembershipModel.js';
import { userModel } from "../model/UserModel.js";

// Controller for creating new membership plans (for Admin)
export const CreateMembershipController = async (req, res) => {
    try {
        const { MembershipName, price, duration, description, membershipType } = req.body;

        // Validate input
        if (!MembershipName) {
            return res.status(400).json({ error: "Membership Name is required", message: "Please provide Membership Name" });
        }
        if (!price) {
            return res.status(400).json({ error: "Price is required", message: "Please provide Price" });
        }
        if (!duration) {
            return res.status(400).json({ error: "Duration is required", message: "Please provide Duration" });
        }
        if (!description) {
            return res.status(400).json({ error: "Description is required", message: "Please provide Description" });
        }
        if (!membershipType) {
            return res.status(400).json({ error: "Membership Type is required", message: "Please provide Membership Type" });
        }




        // Create new membership
        const newMembership = new MembershipModel({
            MembershipName,
            price,
            duration,
            description,
            membershipType,

        });

        // Save the new membership using async/await
        const membership = await newMembership.save();

        return res.status(200).json({ message: "Membership Created Successfully", membership });
    } catch (error) {
        return res.status(400).json({ error: error.message, message: "Failed to create Membership" });
    }
};

// Controller for joining a membership (for User)
export const joinMembership = async (req, res) => {
    try {
        const { paymentMethod, transactionId } = req.body;
        const { _id } = req.params; // This is the membershipId from the URL

        // Validate input fields
        const membership = await MembershipModel.findById(_id);
        if (!membership) {
            return res.status(404).json({ message: "Membership not found" });
        }
        const user = await userModel.findById(req.user?._id)
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email, contactNumber, } = user
        const { duration, price } = membership;
        if (!name || !email || !contactNumber || !paymentMethod || !transactionId) {
            return res.status(400).json({ error: "All fields are required", message: "Please provide all required fields" });
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + duration); // Set end date based on duration

        // Create a new UserMembership
        const newMembership = new UserMembershipModel({
            userId: req.user?._id, // Make sure req.userId is populated by middleware
            membershipId: _id, // Pass the membershipId here
            name,
            email,
            contactNumber,
            paymentMethod,
            transactionId,
            duration,
            price,
            startDate,
            endDate,
        });

        const savedMembership = await newMembership.save();

        return res.status(200).json({ message: "Membership joined successfully", membership: savedMembership });
    } catch (error) {
        return res.status(400).json({ error: error.message, message: "Failed to join membership" });
    }
};