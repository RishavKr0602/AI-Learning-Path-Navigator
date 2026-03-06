// frontend/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activePaths, setActivePaths] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, recsRes, pathsRes] = await Promise.all([
        axios.get('/api/progress'),
        axios.get('/api/recommendations'),
        axios.get('/api/paths/active')
      ]);
      
      setProgress(progressRes.data);
      setRecommendations(recsRes.data);
      setActivePaths(pathsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Learning Progress',
        data: [10, 25, 40, 55, 70, 85],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  const skillData = {
    labels: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    datasets: [
      {
        label: 'Mastery Level',
        data: [80, 65, 45, 30, 55],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your learning progress and recommendations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Paths"
            value={activePaths.length}
            icon="📚"
            color="blue"
          />
          <StatCard
            title="Completed Resources"
            value={user?.completedResources?.length || 0}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Learning Hours"
            value="127"
            icon="⏱️"
            color="purple"
          />
          <StatCard
            title="Skills Mastered"
            value="8"
            icon="🏆"
            color="yellow"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
            <Line data={progressData} />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Skill Mastery</h2>
            <Bar data={skillData} />
          </div>
        </div>

        {/* Active Learning Paths */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Learning Paths</h2>
          <div className="space-y-4">
            {activePaths.map((path, index) => (
              <LearningPathCard key={index} path={path} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded