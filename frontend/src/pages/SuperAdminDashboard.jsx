import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaChartLine } from 'react-icons/fa';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    totalSellers: 0
  });

  useEffect(() => {
    // Fetch dashboard stats here if needed
    // For now, showing placeholder
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SuperAdmin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <FaUserShield className="text-white text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Admins</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalAdmins}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Admins</p>
            <p className="text-2xl font-bold text-gray-800">{stats.activeAdmins}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Sellers</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalSellers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to SuperAdmin Panel</h2>
        <p className="text-gray-600">
          Manage your admins and monitor system activities from this dashboard.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
