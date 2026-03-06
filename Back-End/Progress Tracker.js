// backend/services/ProgressTracker.js
class ProgressTracker {
  constructor() {
    this.progressData = new Map();
  }
  
  async updateProgress(userId, pathId, nodeId, status) {
    const key = `${userId}-${pathId}`;
    
    if (!this.progressData.has(key)) {
      this.progressData.set(key, {
        userId,
        pathId,
        completedNodes: [],
        startTime: new Date(),
        lastActive: new Date()
      });
    }
    
    const userProgress = this.progressData.get(key);
    
    if (status === 'complete' && !userProgress.completedNodes.includes(nodeId)) {
      userProgress.completedNodes.push(nodeId);
      userProgress.lastActive = new Date();
    }
    
    // Calculate overall progress
    const totalNodes = await this.getTotalNodes(pathId);
    const progress = (userProgress.completedNodes.length / totalNodes) * 100;
    
    return {
      completedNodes: userProgress.completedNodes,
      progress: Math.round(progress),
      timeSpent: this.calculateTimeSpent(userProgress),
      estimatedCompletion: this.estimateCompletion(userProgress, totalNodes)
    };
  }
  
  calculateTimeSpent(progress) {
    const now = new Date();
    const diff = now - progress.startTime;
    return Math.round(diff / (1000 * 60 * 60)); // hours
  }
  
  estimateCompletion(progress, totalNodes) {
    const completedCount = progress.completedNodes.length;
    const remainingCount = totalNodes - completedCount;
    const avgTimePerNode = this.calculateAvgTimePerNode(progress);
    
    return {
      remainingNodes: remainingCount,
      estimatedHours: remainingCount * avgTimePerNode,
      estimatedDate: new Date(Date.now() + (remainingCount * avgTimePerNode * 60 * 60 * 1000))
    };
  }
  
  calculateAvgTimePerNode(progress) {
    if (progress.completedNodes.length === 0) return 2; // default 2 hours
    
    const timeSpent = this.calculateTimeSpent(progress);
    return timeSpent / progress.completedNodes.length;
  }
  
  async getTotalNodes(pathId) {
    // Fetch from database
    const LearningPath = require('../models/LearningPath');
    const path = await LearningPath.findById(pathId);
    return path ? path.nodes.length : 0;
  }
  
  getMasteryLevel(userId, skill) {
    // Calculate mastery based on completed resources and assessments
    return {
      skill,
      level: Math.random() * 100, // Replace with actual calculation
      confidence: Math.random() * 100,
      recommendations: this.getSkillRecommendations(skill)
    };
  }
  
  getSkillRecommendations(skill) {
    return [
      `Practice ${skill} with hands-on projects`,
      `Take advanced courses in ${skill}`,
      `Contribute to open source projects using ${skill}`
    ];
  }
}

module.exports = new ProgressTracker();