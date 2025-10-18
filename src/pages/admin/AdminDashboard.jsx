import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Shield,
  Heart,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Filter,
  UserPlus,
  BarChart3,
} from "lucide-react";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/reusable/StatCard";
import { getAllBlotters } from '../../api/blotterApi';
import Select from '../../components/reusable/Select';

const stats = [
  {
    icon: <Users className="text-blue-600" />,
    label: "Total Population",
    value: 1240,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 2.3,
  },
  {
    icon: <UserCheck className="text-green-600" />,
    label: "Official Members",
    value: 15,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 6.7,
  },
  {
    icon: <Users className="text-purple-600" />,
    label: "Senior Citizens",
    value: 210,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 1.2,
  },
  {
    icon: <Shield className="text-orange-600" />,
    label: "PWD",
    value: 35,
    color: "bg-white border-gray-200",
    trend: -1,
    percentage: 0.5,
  },
  {
    icon: <Heart className="text-pink-600" />,
    label: "Single Parents",
    value: 50,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 3.1,
  },
];

const pieChartData = [
  { label: "Registered Voters", value: 900, color: "#7A0000" },
  { label: "Non-Voters", value: 340, color: "#F7DB9F" },
];

const barChartData = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 8 },
  { label: "Mar", value: 15 },
  { label: "Apr", value: 6 },
  { label: "May", value: 9 },
  { label: "Jun", value: 4 },
  { label: "Jul", value: 7 },
  { label: "Aug", value: 11 },
  { label: "Sep", value: 5 },
  { label: "Oct", value: 8 },
  { label: "Nov", value: 3 },
  { label: "Dec", value: 6 },
];

const topRequest = {
  icon: <FileText className="text-indigo-600" />,
  label: "Most Requested Document",
  value: "Barangay Clearance",
  color: "bg-white border-gray-200",
};

const AdminDashboard = () => {
  const scrollRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [blotterStats, setBlotterStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();  

  useEffect(() => {
    const fetchBlotterStats = async () => {
      try {
        setLoading(true);
        const response = await getAllBlotters({
          from_date: `${selectedYear}-01-01`,
          to_date: `${selectedYear}-12-31`,
          per_page: 999999
        });

        if (response.success) {
          // Initialize monthly data with zeros
          const monthlyData = Array(12).fill(0).map((_, index) => ({
            label: new Date(0, index).toLocaleString('default', { month: 'short' }),
            value: 0
          }));

          // Only process if there is data
          if (response.data && response.data.length > 0) {
            response.data.forEach(blotter => {
              const date = new Date(blotter.date_filed);
              // Make sure the date is valid and matches the selected year
              if (!isNaN(date) && date.getFullYear() === selectedYear) {
                const monthIndex = date.getMonth();
                monthlyData[monthIndex].value++;
              }
            });
          }

          const totalCases = monthlyData.reduce((sum, month) => sum + month.value, 0);
          const averagePerMonth = totalCases / 12;

          setBlotterStats({
            monthlyData,
            totalCases,
            averagePerMonth
          });
        }
      } catch (error) {
        console.error('Failed to fetch blotter stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlotterStats();
  }, [selectedYear]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: (new Date().getFullYear() - i).toString()
  }));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Barangay management overview
              </p>
            </div>
          
          
          </div>
        </div>

            {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <UserPlus className="w-4 h-4" />,
                label: "Add Resident",
                color: "border-green-200 text-green-700 hover:bg-green-50",
                onClick: () => navigate('/admin/resident-management/new')
              },
              
              {
                icon: <Users className="w-4 h-4" />,
                label: "View Residents",
                color: "border-purple-200 text-purple-700 hover:bg-purple-50",
                onClick: () => navigate('/admin/resident-management/all-resident')
              },
              
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`${action.color} bg-white border-2 p-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md cursor-pointer hover:scale-105 hover:-translate-y-1`}
              >
                <div className="transition-transform duration-200 hover:scale-110">{action.icon}</div>
                <span className="text-xs font-medium text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="relative w-full mb-8">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(240px,1fr)] gap-4 min-w-max px-0 sm:px-8">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
              <StatCard {...topRequest} />
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Voters Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Voter Distribution
              </h3>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                2024
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <PieChart data={pieChartData} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-lg font-semibold text-blue-600">900</div>
                <div className="text-xs text-gray-600">Registered</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-lg font-semibold text-amber-600">340</div>
                <div className="text-xs text-gray-600">Non-Voters</div>
              </div>
            </div>
          </div>

          {/* Blotter Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Blotter Cases
              </h3>
              <div className="flex items-center gap-3">
                <Select
                  value={yearOptions.find(opt => opt.value === selectedYear)}
                  onChange={(option) => setSelectedYear(option.value)}
                  options={yearOptions}
                  isClearable={false}
                  className="w-32"
                />
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Monthly
                </div>
              </div>
            </div>
            <div className="mb-4">
              {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
                </div>
              ) : (
                <BarChart data={blotterStats?.monthlyData || []} />
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
              <span>Total Cases: {blotterStats?.totalCases || 0}</span>
              <span>
                Average: {blotterStats?.averagePerMonth?.toFixed(1) || 0}/month
              </span>
            </div>
          </div>
        </div>

    
      </div>
  );
};

export default AdminDashboard;
