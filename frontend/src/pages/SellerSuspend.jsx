import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from '../components/Toast';

export default function SellerSuspend() {
  const { showSuccessToast, showErrorToast } = useToast();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API_URL.replace('/api', ''); // Extract base URL from API URL
  console.log("API URL:", api); // Debugging line to check API URL

  const fetchAllSellers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/seller/getseller`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setSellers(data.seller);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSellers();
  }, []);

  const toggleSellerStatus = async (sellerId, currentStatus) => {
    try {
      const res = await fetchWithAuth(`/seller/toggleSellerActive/${sellerId}`, {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSellers(sellers.map(seller => 
          seller._id === sellerId ? { ...seller, active: !currentStatus } : seller
        ));
        showSuccessToast(data.message);
      } else {
        alert(data.message || 'Failed to update seller status');
      }
    } catch (error) {
      showErrorToast('Error updating seller status');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Sellers</h1>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sellers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No sellers found</td>
                  </tr>
                ) : (
                  sellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {seller.sellerImage ? (
                          <img src={`${api}/${seller.sellerImage}`} alt={seller.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                            {seller.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{seller.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{seller.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{seller.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{seller.address || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {seller.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleSellerStatus(seller._id, seller.active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            seller.active ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            seller.active ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
