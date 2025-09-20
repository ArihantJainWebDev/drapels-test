import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  estimatedDuration: {
    type: String, // e.g., "3 months", "6 weeks"
    required: true,
  },
  technologies: [String],
  steps: [{
    id: String,
    title: String,
    description: String,
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['article', 'video', 'course', 'documentation', 'practice'],
      }
    }],
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    estimatedTime: String, // e.g., "2 hours", "1 week"
  }],
  progress: {
    completedSteps: {
      type: Number,
      default: 0,
    },
    totalSteps: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
roadmapSchema.index({ userId: 1 });
roadmapSchema.index({ category: 1 });
roadmapSchema.index({ isPublic: 1 });
roadmapSchema.index({ tags: 1 });
roadmapSchema.index({ createdAt: -1 });

export default mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);