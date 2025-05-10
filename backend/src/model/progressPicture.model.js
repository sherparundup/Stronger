// models/Transformation.js
import mongoose from 'mongoose';

const ProgressPictureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  },
  beforeImage: {
    type: String, // URL to image stored on cloud storage
    required: true
  },
  afterImage: {
    type: String, // URL to image stored on cloud storage
    required: true
  },
  weightBefore: {
    type: Number
  },
  weightAfter: {
    type: Number
  },
  timePeriod: {
    type: String, // e.g., "3 months", "1 year"
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const ProgressPictureModel= mongoose.model('Transformation', ProgressPictureSchema);
export default ProgressPictureModel;