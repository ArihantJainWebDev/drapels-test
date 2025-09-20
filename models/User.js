import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  // Custom fields for your application
  displayName: {
    type: String,
    required: false,
  },
  credits: {
    type: Number,
    default: 100, // Default credits for new users
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      email: { type: Boolean, default: true },
      browser: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
  },
  profile: {
    bio: String,
    location: String,
    website: String,
    github: String,
    linkedin: String,
    twitter: String,
    company: String,
    jobTitle: String,
    skills: [String],
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
  },
  progress: {
    completedCourses: [String],
    currentCourse: String,
    totalXP: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'progress.completedCourses': 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);