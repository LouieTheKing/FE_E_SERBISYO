import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useUser } from '../../contexts/UserContext';
import StatCard from '../../components/reusable/StatCard';
import { getAllRequests } from '../../api/documentApi';

const ResidentDashboard = () => {
  const { currentUser } = useUser();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    activeCases: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);   
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await getAllRequests();
        const userRequests = response.data.filter(req => req.requestor === currentUser?.id);
        
        setStats({
          totalRequests: userRequests.length,
          pendingRequests: userRequests.filter(req => ['pending', 'processing'].includes(req.status)).length,
          completedRequests: userRequests.filter(req => req.status === 'released').length,
          activeCases: userRequests.filter(req => req.status === 'active').length
        });

        // Get 5 most recent requests
        setRecentRequests(userRequests.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  const dashboardStats = [
    {
      icon: <FiFileText />,
      label: "Total Documents",
      value: stats.totalRequests,
      color: "text-blue-600"
    },
    {
      icon: <FiClock />,
      label: "In Progress",
      value: stats.pendingRequests,
      color: "text-amber-600"
    },
    {
      icon: <FiCheckCircle />,
      label: "Completed",
      value: stats.completedRequests,
      color: "text-emerald-600"
    },
    {
      icon: <FiAlertCircle />,
      label: "Active Cases",
      value: stats.activeCases,
      color: "text-purple-600"
    }
  ];

  const RequestCard = ({ request }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 hover:pl-6 transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125 ${
          request.status === 'pending' ? 'bg-amber-500' :
          request.status === 'processing' ? 'bg-blue-500' :
          request.status === 'approved' ? 'bg-emerald-500' :
          'bg-red-500'
        }`} />
        <div>
          <p className="text-sm font-medium text-gray-900 group-hover:text-red-700 transition-colors duration-200">{request.document_details?.document_name}</p>
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">{new Date(request.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
        {request.status}
      </span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {currentUser?.first_name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Here's an overview of your documents and requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.label === "Active Cases" ? "/resident/blotter/my-cases" : "/resident/certificates/my-requests"}
            className="p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color} transition-transform duration-200 group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{stat.label}</p>
                <p className="text-xl font-semibold mt-1 group-hover:text-red-700 transition-colors duration-200">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white border border-gray-100 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent Requests</h2>
          <Link 
            to="/resident/certificates/my-requests"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-12 bg-gray-50 rounded" />
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            recentRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">No recent requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
