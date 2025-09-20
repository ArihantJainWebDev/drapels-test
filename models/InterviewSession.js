import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'system_design', 'coding'],
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    answer: String,
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    timeSpent: Number, // in minutes
  }],
  overallRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    generalFeedback: String,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  scheduledAt: Date,
  startedAt: Date,
  completedAt: Date,
  tags: [String],
  notes: String,
}, {
  timestamps: true,
});

// Indexes for better performance
interviewSessionSchema.index({ userId: 1 });
interviewSessionSchema.index({ type: 1 });
interviewSessionSchema.index({ status: 1 });
interviewSessionSchema.index({ scheduledAt: 1 });
interviewSessionSchema.index({ createdAt: -1 });

export default mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);