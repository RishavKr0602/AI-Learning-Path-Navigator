// frontend/components/Features.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCpu, 
  FiPath, 
  FiGrid, 
  FiActivity, 
  FiMap, 
  FiBarChart2 
} from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: "AI-Based Recommendation",
      description: "Machine learning algorithms match resources to your unique profile, learning style, and goals",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiPath className="w-8 h-8" />,
      title: "Personalized Learning Paths",
      description: "Custom sequences that adapt to your pace, prior knowledge, and available time",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiGrid className="w-8 h-8" />,
      title: "Multi-Source Aggregation",
      description: "Unified access to courses, videos, documentation, articles, and tutorials across platforms",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiActivity className="w-8 h-8" />,
      title: "Dynamic Adaptation",
      description: "Real-time path adjustments based on progress, feedback, and changing goals",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FiMap className="w-8 h-8" />,
      title: "Visual Roadmap",
      description: "Interactive timeline showing milestones, dependencies, and completion progress",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Dashboard with completion rates, skill mastery levels, time spent, and achievement tracking",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to master any skill with personalized AI-powered guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;