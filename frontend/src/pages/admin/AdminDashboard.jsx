import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { ChefHat, BookOpen, Users, FolderOpen, Layers } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { DashboardStatsSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      setError('Failed to load dashboard analytics statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <DashboardStatsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;
  if (!data) return <ErrorState title="No Analytics Available" message="Please populate recipes to enable chart statistics." />;

  // 1. Doughnut Chart: Recipes by Category
  const categoriesMap = data.categoryDistribution || {};
  const doughnutData = {
    labels: Object.keys(categoriesMap),
    datasets: [
      {
        data: Object.values(categoriesMap),
        backgroundColor: [
          '#fbbf24', // Breakfast: Amber
          '#34d399', // Lunch: Emerald
          '#60a5fa', // Dinner: Blue
          '#f472b6', // Snacks: Pink
          '#c084fc', // Desserts: Purple
          '#22d3ee', // Beverages: Cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          font: { size: 11, family: 'Inter' },
          color: document.body.classList.contains('dark') ? '#94a3b8' : '#475569',
        },
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
      }
    },
  };

  // 2. Line Chart: Recipe Growth Overview
  const growthMap = data.growthOverview || {};
  const lineData = {
    labels: Object.keys(growthMap),
    datasets: [
      {
        label: 'Recipes Published',
        data: Object.values(growthMap),
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.15)', // transparent amber
        borderColor: '#f59e0b', // brand 500
        borderWidth: 3,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#f59e0b',
        pointHoverRadius: 6,
        tension: 0.35, // curved line
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 11, family: 'Inter' },
          color: document.body.classList.contains('dark') ? '#64748b' : '#94a3b8',
        },
        grid: {
          color: document.body.classList.contains('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        }
      },
      x: {
        ticks: {
          font: { size: 11, family: 'Inter' },
          color: document.body.classList.contains('dark') ? '#64748b' : '#94a3b8',
        },
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Welcome Banner */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <ChefHat className="text-brand-500" size={24} />
          <span>Admin Analytics Dashboard</span>
        </h2>
        <p className="text-gray-400 text-xs">Analyze database statistics, moderation counts, and system metrics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Recipes</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data.totalRecipes}</p>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-darkbg-850 text-brand-500 rounded-2xl">
            <FolderOpen size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">Admin Added Recipes</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data.adminAddedRecipes}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-darkbg-850 text-amber-500 rounded-2xl">
            <Layers size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">User Added Recipes</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data.userAddedRecipes}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-darkbg-850 text-blue-500 rounded-2xl">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data.totalUsers}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-darkbg-850 text-purple-500 rounded-2xl">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Growth Overview */}
        <div className="lg:col-span-7 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider pl-1">
            Recipe Growth Overview
          </h3>
          <div className="h-64 relative">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Category Pie distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider pl-1">
            Recipes By Category
          </h3>
          <div className="h-64 relative flex items-center justify-center">
            {data.totalRecipes > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <span className="text-xs text-gray-400 italic">No categories mapped yet...</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default AdminDashboard;
