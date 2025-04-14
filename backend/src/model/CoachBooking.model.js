import mongoose from "mongoose"
const CoachBookingSchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachVerification',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  selectedDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CoachBookingModel = mongoose.model('CoachBooking', CoachBookingSchema);

export default CoachBookingModel;