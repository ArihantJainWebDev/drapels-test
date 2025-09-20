import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
  },
  stepId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'skipped'],
    default: 'not_started',
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
  notes: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  resources: [{
    resourceId: String,
    completed: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
  }],
}, {
  timestamps: true,
});

// Compound indexes for better query performance
progressSchema.index({ userId: 1, roadmapId: 1 });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ roadmapId: 1, stepId: 1 });

export default mongoose.models.Progress || mongoose.model('Progress', progressSchema);