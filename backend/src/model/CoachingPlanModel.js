import mongoose from "mongoose";

const coachingPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  durationInWeeks: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  type: {
    type: String,
    enum: ['bulking', 'cutting', 'strength', 'general', 'custom'],
    default: 'general',
  },
  targetAudience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  
  image: {
    url: {
      type: String,
    },
  }, 
  pdf: {
    url: {
      type: String,
    },
  }, 

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const CoachingPlanModel = mongoose.model('CoachingPlan', coachingPlanSchema);

export default CoachingPlanModel;