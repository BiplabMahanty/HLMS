import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaClock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Dashboard.css';
import {useToast} from '../components/Toast';
import { fetchWithAuth } from '../utils/api';

const AddLotteryType = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    returnEnd: ''
  });
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

   const togglelotteryStatus = async (lotteryId, currentStatus) => {
      try {
        const res = await fetchWithAuth(`/seller/toggleLottaryActive/${lotteryId}`, {
          method: 'POST'
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setLotteryTypes(lotteryTypes.map(lottery => 
            lottery._id === lotteryId ? { ...lottery, active: !currentStatus } : lottery
          ));
          showSuccessToast(data.message || 'Status updated successfully');
        } else {
          showErrorToast(data.message || 'Failed to update lottery status');
        }
      } catch (error) {
        showErrorToast('Error updating lottery status');
      }
    };

  useEffect(() => {
    fetchLotteryTypes();
  }, []);

  const fetchLotteryTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seller/getlotteryType`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLotteryTypes(data.lotteryType || []);
      }
    } catch (err) {
      console.error('Failed to fetch lottery types:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seller/addLotteryType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Lottery type added successfully!' });
        setFormData({ name: '', returnEnd: '' });
        fetchLotteryTypes();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add lottery type' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lottery) => {
    setEditingId(lottery._id);
    setEditData({ name: lottery.name, returnEnd: lottery.returnEnd || '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seller/updateLotteryType`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, ...editData }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Lottery type updated successfully!' });
        setEditingId(null);
        setEditData({});
        fetchLotteryTypes();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Lottery Type</h1>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lottery Name</label>
            <div className="relative">
              <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter lottery type name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return End Time</label>
            <div className="relative">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="returnEnd"
                value={formData.returnEnd}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter return end time (optional)"
              />
            </div>
          </div>

          {message.text && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Lottery Type'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lottery Types List</h2>

      {!loading ? (
  lotteryTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No lottery types found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Return End</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Suspend Action</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lotteryTypes.map((lottery) => (
                  <tr key={lottery._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {editingId === lottery._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{lottery.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === lottery._id ? (
                        <input
                          type="text"
                          name="returnEnd"
                          value={editData.returnEnd}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-600">{lottery.returnEnd || '-'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lottery.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {lottery.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                         <td className="px-3 py-4">
                        <button
                          onClick={() => togglelotteryStatus(lottery._id, lottery.active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            lottery.active ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            lottery.active ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        {editingId === lottery._id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(lottery._id)}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                              title="Save"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(lottery)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
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
      )}
      </div>
    </div>
  );
};

export default AddLotteryType;
