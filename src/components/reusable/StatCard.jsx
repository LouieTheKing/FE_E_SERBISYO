import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ icon, label, value, color = "bg-white border-gray-200", trend, percentage }) => (
  <div className={`${color} rounded-lg p-4 border hover:shadow-lg hover:border-gray-300 hover:scale-105 hover:-translate-y-1 transition-all duration-200 cursor-pointer group`}>
    <div className="flex items-center justify-between mb-3">
      <div className="text-lg group-hover:scale-110 transition-transform duration-200">{icon}</div>
      {typeof trend === 'number' && (
        <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}> 
          <TrendingUp className={`mr-1 w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(percentage)}%
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-700 transition-colors duration-200">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
    <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{label}</p>
  </div>
);

export default StatCard;
