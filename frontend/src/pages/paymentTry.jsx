import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from '../components/Toast';

export default function Payment() {
  const [sellers, setSellers] = useState([]);
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningTypeId, setMorningTypeId] = useState('');
  const [morningData, setMorningData] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [vouter, setVouter] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousNumbers, setPreviousNumbers] = useState([]);
  

  useEffect(() => {
    fetchSellers();
    fetchLotteryTypes();
  }, []);

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchShiftData();
    }
  }, [selectedSeller, selectedDate, morningTypeId]);

  const fetchSellers = async () => {
    try {
      const res = await fetchWithAuth('/seller/getseller');
      const data = await res.json();
      setSellers(data.seller || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const fetchLotteryTypes = async () => {
    try {
      const res = await fetchWithAuth('/seller/getlotteryType');
      const data = await res.json();
      setLotteryTypes(data.lotteryType || []);
    } catch (error) {
      console.error('Error fetching lottery types:', error);
    }
  };
  const shifts = ["thirtySem", "fiveSem", "tenSem", "hundredSem", "twoHundredSem", "fiftySem"];

  // const fetchShiftData = async () => {
  //   try {
  //     if (morningTypeId) {
  //       const res = await fetchWithAuth('/seller/shift', {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           lotteryTypeId: morningTypeId,
  //           sellerId: selectedSeller,
  //           dateKey: selectedDate
  //         })
  //       });
  //       const data = await res.json();
  //       setMorningData(data.data);

  //       if (data.data && data.data.sellTickets) {
  //         const tickets = data.data.sellTickets;
  //         const formattedNumbers = [];
          
  //         shifts.forEach(shift => {
  //           if (tickets[shift] && tickets[shift].length > 0) {
  //             const numbers = tickets[shift];
  //             const groups = groupConsecutiveNumbers(numbers);
              
  //             groups.forEach((group, index) => {
  //               formattedNumbers.push({
  //                 id: `${shift}-${index}`,
  //                 type: getLotteryTypeName(morningTypeId),
  //                 shift: shift,
  //                 startNumber: String(group.start).padStart(5, '0'),
  //                 endNumber: String(group.end).padStart(5, '0'),
  //                 timestamp: new Date(data.data.createdAt).toLocaleString()
  //               });
  //             });
  //           }
  //         });
          
  //         setPreviousNumbers(formattedNumbers);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching shift data:', error);
  //   }
  // };

  const fetchShiftData = async () => {
  try {
    if (morningTypeId) {
      const res = await fetchWithAuth('/seller/shift', {
        method: 'POST',
        body: JSON.stringify({
          lotteryTypeId: morningTypeId,
          sellerId: selectedSeller,
          dateKey: selectedDate
        })
      });
      const data = await res.json();
      setMorningData(data.data);

      if (data.data && data.data.sellTickets) {
        const tickets = data.data.sellTickets;
        const formattedNumbers = [];
        
        const shiftValues = {
          thirtySem: 30,
          fiveSem: 5,
          tenSem: 10,
          hundredSem: 100,
          twoHundredSem: 200,
          fiftySem: 50
        };
        
        shifts.forEach(shift => {
          if (tickets[shift] && tickets[shift].length > 0) {
            const numbers = tickets[shift];
            const groups = groupConsecutiveNumbers(numbers);
            
            groups.forEach((group, index) => {
              formattedNumbers.push({
                id: `${shift}-${index}`,
                type: getLotteryTypeName(morningTypeId),
                shift: shift,
                startNumber: String(group.start).padStart(5, '0'),
                endNumber: String(group.end).padStart(5, '0'),
                value: shiftValues[shift],
                dateKey: data.data.dateKey, 
                timestamp: new Date(data.data.createdAt).toLocaleString()
              });
            });
          }
        });
        
        setPreviousNumbers(formattedNumbers);
      }
    }
  } catch (error) {
    console.error('Error fetching shift data:', error);
  }
};

    // Helper function to group consecutive numbers
  const groupConsecutiveNumbers = (numbers) => {
    if (!numbers || numbers.length === 0) return [];
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const groups = [];
    let start = sorted[0];
    let end = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        groups.push({ start, end });
        start = sorted[i];
        end = sorted[i];
      }
    }
    groups.push({ start, end });
    
    return groups;
  };
  
  // Get lottery type name by ID
  const getLotteryTypeName = (id) => {
    const lottery = lotteryTypes.find(l => l._id === id);
    return lottery ? lottery.name : 'Unknown';
  };

  const handlePayment = async () => {
    if (!selectedSeller) {
      alert('Please select a seller');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth('/seller/paymentDay', {
        method: 'POST',
        body: JSON.stringify({
          sellerId: selectedSeller,
          typeMorningId: morningTypeId,
          amountPaid: Number(amountPaid) || 0,
          vouter: Number(vouter) || 0,
          paymentMethod,
          note
        })
      });

      alert('Payment recorded successfully!');
      setAmountPaid('');
      setVouter('');
      setNote('');
      fetchShiftData();
    } catch (error) {
      console.error('Error recording payment:', error);
      alert(error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const getShiftTotal = (shiftData) => {
    if (!shiftData?.sellTickets) return 0;
    return shiftData.sellTickets.totalNumberAmount || 0;
  };

  const getTotalBill = () => {
    return getShiftTotal(morningData);
  };

  // Helper function to group consecutive numbers from ticket ranges
  const groupTicketRanges = (tickets) => {
    if (!tickets || tickets.length === 0) return [];
    
    // Extract all individual numbers from ranges
    const allNumbers = [];
    tickets.forEach(ticket => {
      const start = parseInt(ticket.startNumber) || 0;
      const end = parseInt(ticket.endNumber) || 0;
      const type = ticket.type;
      
      for (let i = start; i <= end; i++) {
        allNumbers.push({ number: i, type });
      }
    });
    
    // Sort by number
    allNumbers.sort((a, b) => a.number - b.number);
    
    if (allNumbers.length === 0) return [];
    
    // Group consecutive numbers
    const groups = [];
    let currentGroup = {
      type: allNumbers[0].type,
      start: allNumbers[0].number,
      end: allNumbers[0].number
    };
    
    for (let i = 1; i < allNumbers.length; i++) {
      if (allNumbers[i].number === currentGroup.end + 1 && allNumbers[i].type === currentGroup.type) {
        currentGroup.end = allNumbers[i].number;
      } else {
        groups.push({ ...currentGroup });
        currentGroup = {
          type: allNumbers[i].type,
          start: allNumbers[i].number,
          end: allNumbers[i].number
        };
      }
    }
    groups.push(currentGroup);
    
    return groups;
  };

  const sellerInfo = sellers.find(s => s._id === selectedSeller);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Management</h1>

        {/* Seller & Date Selection */}
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
                <img src={sellerInfo.sellerImage} alt={sellerInfo.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
              )}
              <div>
                <p className="font-medium text-gray-800">{sellerInfo.name}</p>
                <p className="text-sm text-gray-500">{sellerInfo.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Morning Selection and Ticket Data */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Morning */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-5">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">🌅 Morning</h3>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Lottery Type</label>
              <div className="flex flex-wrap gap-2">
                {lotteryTypes.map(type => (
                  <button
                    key={type._id}
                    onClick={() => setMorningTypeId(type._id)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      morningTypeId === type._id
                        ? 'bg-orange-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
            {morningData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">30 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.thirtySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.fiveSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.tenSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">50 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.fiftySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">100 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.hundredSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">200 Sem:</span>
                  <span className="font-semibold">{morningData.sellTickets?.twoHundredSem?.length || 0}</span>
                </div>
                <div className="pt-2 border-t border-orange-200 flex justify-between">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="font-bold text-orange-700">₹{getShiftTotal(morningData)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tickets Table */}
          {morningData && (() => {
            const allGroupedTickets = [];
            
            // Process each category
            const categories = [
              { name: 'fiveSem', value: 5, tickets: morningData.sellTickets?.fiveSem },
              { name: 'tenSem', value: 10, tickets: morningData.sellTickets?.tenSem },
              { name: 'thirtySem', value: 30, tickets: morningData.sellTickets?.thirtySem },
              { name: 'fiftySem', value: 50, tickets: morningData.sellTickets?.fiftySem },
              { name: 'hundredSem', value: 100, tickets: morningData.sellTickets?.hundredSem },
              { name: 'twoHundredSem', value: 200, tickets: morningData.sellTickets?.twoHundredSem }
            ];
            
            categories.forEach(category => {
              if (category.tickets && category.tickets.length > 0) {
                const grouped = groupTicketRanges(category.tickets);
                grouped.forEach(group => {
                  allGroupedTickets.push({
                    ...group,
                    category: category.name,
                    value: category.value
                  });
                });
              }
            });
            
            return (
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Ticket Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Number</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">End Number</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previousNumbers.map((number) => {
                          const count = parseInt(number.endNumber) - parseInt(number.startNumber) + 1;
                        const amount = count * number.value;
                        return (
                          <tr key={number.id  } className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.dateKey}</td>

                            <td className="py-2 px-3 text-sm text-gray-600">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {number.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-600">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {number.shift}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.startNumber}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.endNumber}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 font-semibold">{count}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 font-semibold text-right">₹{amount}</td>
                          </tr>
                        );
                      })}
                      {allGroupedTickets.length > 0 && (
                        <tr className="bg-orange-50 font-semibold border-t-2 border-orange-200">
                          <td colSpan="4" className="py-3 px-3 text-sm text-gray-700">Total</td>
                          <td className="py-3 px-3 text-sm text-gray-700">
                            {allGroupedTickets.reduce((sum, t) => sum + (t.end - t.start + 1), 0)}
                          </td>
                          <td className="py-3 px-3 text-sm text-orange-700 text-right">₹{getShiftTotal(morningData)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher</label>
              <input
                type="number"
                value={vouter}
                onChange={(e) => setVouter(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-700">Total Bill:</span>
              <span className="font-bold text-green-600 text-2xl">₹{getTotalBill()}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !selectedSeller}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Processing...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
