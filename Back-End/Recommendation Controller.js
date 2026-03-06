// backend/controllers/recommendationController.js
const User = require('../models/User');
const Resource = require('../models/Resource');

class RecommendationController {
  // Get personalized recommendations
  async getRecommendations(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      
      // Extract user preferences
      const userSkills = user.currentSkills.map(s => s.skill);
      const userGoals = user.learningGoals.map(g => g.type);
      const preferredPlatforms = user.preferredPlatforms;
      
      // Query resources based on user profile
      const recommendations = await Resource.find({
        $or: [
          { skills: { $in: userSkills } },
          { topics: { $in: userGoals } }
        ],
        platform: { $in: preferredPlatforms },
        difficulty: { $in: this.getDifficultyLevels(user) }
      })
      .sort({ rating: -1, popularity: -1 })
      .limit(20);
      
      // Apply collaborative filtering
      const filteredRecs = await this.collaborativeFiltering(user, recommendations);
      
      res.json(filteredRecs);
    } catch (error) {
      res.status(500).json({ message: 'Error getting recommendations', error: error.message });
    }
  }
  
  // Generate personalized learning path
  async generateLearningPath(req, res) {
    try {
      const userId = req.userId;
      const { goal, timeframe } = req.body;
      
      const user = await User.findById(userId);
      
      // Get relevant resources
      const resources = await Resource.find({
        topics: { $in: [goal] },
        difficulty: { $in: ['beginner', 'intermediate', 'advanced'] }
      });
      
      // Build dependency graph
      const path = this.buildDependencyGraph(resources, user);
      
      // Calculate timeline
      const timeline = this.calculateTimeline(path, timeframe);
      
      res.json({ path, timeline });
    } catch (error) {
      res.status(500).json({ message: 'Error generating path', error: error.message });
    }
  }
  
  // Helper methods
  getDifficultyLevels(user) {
    const avgLevel = this.calculateAverageSkillLevel(user);
    if (avgLevel < 2) return ['beginner'];
    if (avgLevel < 3) return ['beginner', 'intermediate'];
    return ['intermediate', 'advanced'];
  }
  
  calculateAverageSkillLevel(user) {
    const levelMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
    const levels = user.currentSkills.map(s => levelMap[s.level]);
    return levels.reduce((a, b) => a + b, 0) / levels.length;
  }
  
  async collaborativeFiltering(user, resources) {
    // Find similar users
    const similarUsers = await User.find({
      'currentSkills.skill': { $in: user.currentSkills.map(s => s.skill) },
      _id: { $ne: user._id }
    }).limit(10);
    
    // Get resources liked by similar users
    const likedResources = similarUsers.flatMap(u => u.completedResources);
    
    // Score resources based on similar users' preferences
    const scoredResources = resources.map(resource => {
      const score = likedResources.filter(lr => lr.resourceId === resource._id.toString()).length;
      return { ...resource.toObject(), score };
    });
    
    return scoredResources.sort((a, b) => b.score - a.score);
  }
  
  buildDependencyGraph(resources, user) {
    // Create nodes
    const nodes = resources.map(r => ({
      id: r._id,
      title: r.title,
      type: r.type,
      difficulty: r.difficulty,
      estimatedHours: r.duration / 60,
      dependencies: r.prerequisites,
      skills: r.skills
    }));
    
    // Topological sort based on dependencies
    const sorted = this.topologicalSort(nodes);
    
    // Add order numbers
    sorted.forEach((node, index) => {
      node.order = index + 1;
    });
    
    return sorted;
  }
  
  topologicalSort(nodes) {
    const visited = new Set();
    const stack = [];
    
    function dfs(node) {
      visited.add(node.id);
      
      node.dependencies.forEach(depId => {
        const depNode = nodes.find(n => n.id.toString() === depId);
        if (depNode && !visited.has(depNode.id)) {
          dfs(depNode);
        }
      });
      
      stack.push(node);
    }
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node);
      }
    });
    
    return stack.reverse();
  }
  
  calculateTimeline(path, timeframe) {
    const totalHours = path.reduce((sum, node) => sum + node.estimatedHours, 0);
    const weeksAvailable = timeframe || 12; // default 12 weeks
    const hoursPerWeek = totalHours / weeksAvailable;
    
    return {
      totalHours,
      weeksAvailable,
      hoursPerWeek: Math.ceil(hoursPerWeek),
      weeklyBreakdown: path.map((node, index) => ({
        week: Math.floor(index * weeksAvailable / path.length) + 1,
        resource: node.title,
        hours: node.estimatedHours
      }))
    };
  }
}

module.exports = new RecommendationController();