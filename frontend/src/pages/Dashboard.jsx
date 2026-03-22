import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaTicketAlt, FaMoneyBillWave, FaChartLine, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    totalSellers: 0,
    activeSellers: 0,
    totalTickets: 0,
    totalDeletedTickets: 0,
    totalRevenue: 0,
    totalDue: 0,
    totalBill: 0,
    todayRevenue: 0,
    todayBill: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const response = await axios.get(`${apiUrl}/seller/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="pl">
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
          <div className="pl__dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Admins</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAdmins}</p>
              <p className="text-green-600 text-xs mt-1">Active: {stats.activeAdmins}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUserShield className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sellers</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalSellers}</p>
              <p className="text-green-600 text-xs mt-1">Active: {stats.activeSellers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Client</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalClients}</p>
              <p className="text-green-600 text-xs mt-1">Active: {stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalTickets}</p>
              <p className="text-red-600 text-xs mt-1">Deleted: {stats.totalDeletedTickets}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <FaTicketAlt className="text-white text-xl" />
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-orange-600 text-xs mt-1">Due: ₹{stats.totalDue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Today's Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-600">Today's Revenue</span>
              <span className="text-2xl font-bold text-green-600">₹{stats.todayRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-600">Today's Bill</span>
              <span className="text-2xl font-bold text-blue-600">₹{stats.todayBill.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bill Amount</span>
              <span className="text-2xl font-bold text-purple-600">₹{stats.totalBill.toLocaleString()}</span>
            </div>
          </div>
        </div>

          <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Payments</h2>
          
        {!showPaymentDetails ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentPayments.length > 0 ? (
              stats.recentPayments.map((payment) => (
                <div key={payment._id} onClick={()=>{setSelectedPayment(payment); setShowPaymentDetails(true);}} className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-800">{payment.sellerId?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{payment.sellerId?.phone || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{payment.amountPaid.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent payments</p>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <button onClick={()=>setShowPaymentDetails(false)} className="text-blue-600 hover:text-blue-800 text-sm mb-3 sticky top-0 bg-white z-10">← Back to list</button>
            {selectedPayment && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Seller Name</p>
                  <p className="font-medium text-gray-800">{selectedPayment.sellerId?.name || 'N/A'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{selectedPayment.sellerId?.phone || 'N/A'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600">₹{selectedPayment.amountPaid?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Today Bill</p>
                  <p className="font-medium text-gray-800">₹{selectedPayment.todayBill?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-800">₹{selectedPayment.totalAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Today Remaining</p>
                  <p className="font-medium text-orange-600">₹{selectedPayment.todayRemaining?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Previous Due</p>
                  <p className="font-medium text-red-600">₹{selectedPayment.previousDue?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Remaining Due</p>
                  <p className="font-medium text-red-600">₹{selectedPayment.remainingDue?.toLocaleString() || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Voucher</p>
                  <p className="font-medium text-gray-800">{selectedPayment.vouter || 0}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800">{selectedPayment.paymentMethod || 'pending'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Payment Date</p>
                  <p className="font-medium text-gray-800">{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Date Added</p>
                  <p className="font-medium text-gray-800">{selectedPayment.dateAdded || 'N/A'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">{selectedPayment.inActive ? 'Inactive' : 'Active'}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-gray-800">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                </div>
                {selectedPayment.ticketId && (
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">Ticket ID</p>
                    <p className="font-medium text-gray-800">{selectedPayment.ticketId}</p>
                  </div>
                )}
                {selectedPayment.deleteTicketId && (
                  <div className="border-b pb-2">
                    <p className="text-xs text-gray-500">Delete Ticket ID</p>
                    <p className="font-medium text-gray-800">{selectedPayment.deleteTicketId}</p>
                  </div>
                )}
                {selectedPayment.note && (
                  <div className="col-span-2 border-b pb-2">
                    <p className="text-xs text-gray-500">Note</p>
                    <p className="font-medium text-gray-800">{selectedPayment.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-2">Collection Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalBill > 0 ? ((stats.totalRevenue / stats.totalBill) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-2">Pending Amount</p>
            <p className="text-2xl font-bold text-red-600">₹{stats.totalDue.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-2">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeSellers + stats.activeAdmins}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
