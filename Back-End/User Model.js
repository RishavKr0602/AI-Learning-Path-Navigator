// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  learningGoals: [{
    type: String,
    description: String,
    targetDate: Date,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  currentSkills: [{
    skill: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number
  }],
  preferredPlatforms: [{
    type: String,
    enum: ['youtube', 'coursera', 'udemy', 'edx', 'documentation', 'articles']
  }],
  timeAvailability: {
    hoursPerWeek: Number,
    preferredTimeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    }
  },
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'reading', 'kinesthetic']
  },
  completedResources: [{
    resourceId: String,
    completedAt: Date,
    rating: Number
  }],
  activePaths: [{
    pathId: String,
    startedAt: Date,
    currentStep: Number,
    progress: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);