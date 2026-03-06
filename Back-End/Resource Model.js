// backend/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['course', 'video', 'article', 'documentation', 'tutorial']
  },
  platform: String,
  url: String,
  thumbnail: String,
  duration: Number, // in minutes
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  topics: [String],
  skills: [String],
  prerequisites: [String],
  rating: {
    average: Number,
    count: Number
  },
  popularity: Number,
  language: String,
  price: {
    type: String,
    enum: ['free', 'paid', 'freemium']
  },
  certificate: Boolean,
  provider: String,
  instructor: String,
  lastUpdated: Date,
  tags: [String],
  metadata: {
    views: Number,
    likes: Number,
    enrollments: Number
  }
});

module.exports = mongoose.model('Resource', resourceSchema);