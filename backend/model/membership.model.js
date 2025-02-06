import mongoose from "mongoose";

// Membership Schema for Admin to create membership plans
const MembershipSchema = new mongoose.Schema({
  MembershipName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // Duration in months
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    enum: ['Standard', 'Premium'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// User Membership Schema - For tracking user memberships with payment details
const UserMembershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References User model
    required: true
  },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership', // References Membership model
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    },
  duration: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Pending'],
    default: 'Pending',
  },
  // Payment Details
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },

  price: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online'],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  }
});

// Model Creation
const UserMembershipModel = mongoose.model("UserMembership", UserMembershipSchema);
const MembershipModel = mongoose.model("Membership", MembershipSchema);

export { MembershipModel, UserMembershipModel };
