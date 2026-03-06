// backend/models/LearningPath.js
const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    title: String,
    description: String,
    targetDate: Date
  },
  nodes: [{
    resourceId: String,
    title: String,
    type: {
      type: String,
      enum: ['course', 'video', 'article', 'documentation', 'project']
    },
    platform: String,
    url: String,
    estimatedHours: Number,
    dependencies: [String], // IDs of prerequisite nodes
    completed: {
      type: Boolean,
      default: false
    },
    order: Number,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    skills: [String]
  }],
  totalEstimatedHours: Number,
  progress: {
    type: Number,
    default: 0
  },
  startedAt: Date,
  completedAt: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'abandoned'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearningPath', learningPathSchema);