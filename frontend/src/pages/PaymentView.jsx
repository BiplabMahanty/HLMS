import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

export default function PaymentView() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchPayments();
    }
  }, [selectedSeller, selectedDate]);

  const fetchSellers = async () => {
    try {
      const res = await fetchWithAuth('/seller/getseller');
      const data = await res.json();
      setSellers(data.seller || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/seller/payments?sellerId=${selectedSeller}&date=${selectedDate}`);
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const sellerInfo = sellers.find(s => s._id === selectedSeller);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  const apiUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment View</h1>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Seller</label>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a seller...</option>
                {sellers.map(seller => (
                  <option key={seller._id} value={seller._id}>{seller.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {sellerInfo && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {sellerInfo.sellerImage && (
                <img src={`${apiUrl}/${sellerInfo.sellerImage}`}
                 alt={sellerInfo.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
              )}
              <div>
                <p className="font-medium text-gray-800">{sellerInfo.name}</p>
                <p className="text-sm text-gray-500">{sellerInfo.phone}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Amount Paid:</span>
                <span className="text-2xl font-bold text-green-600">₹{totalPaid}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ₹{payment.amountPaid || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.vouter || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.vouter + payment.amountPaid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                        {payment.totalAmount || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.todayRemaining || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                        {payment.remainingDue || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {payment.paymentMethod}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.note || '-'}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : selectedSeller && selectedDate ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">No payments found for the selected date and seller.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">Please select a seller and date to view payments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
