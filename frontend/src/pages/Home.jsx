// src/Home.jsx
import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedLotteryType, setSelectedLotteryType] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [previousNumbers, setPreviousNumbers] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]);
  const [selectedFilterLottery, setSelectedFilterLottery] = useState('');
  
  const [sellers, setSellers] = useState([]);
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [shiftData, setShiftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log("Selected Date:", selectedDate);

  const shifts = ["thirtySem", "fiveSem", "tenSem", "hundredSem", "twoHundredSem", "fiftySem"];

  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetchWithAuth("/seller/getseller");
        const data = await res.json();
        setSellers(data.seller || []);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setError("Failed to fetch sellers");
      }
    };
    fetchSellers();
  }, []);

  // Fetch lottery types
  useEffect(() => {
    const fetchLotteryTypes = async () => {
      try {
        const res = await fetchWithAuth("/seller/getlotteryType");
        const data = await res.json();
        setLotteryTypes(data.lotteryType || []);
      } catch (error) {
        console.error("Error fetching lottery types:", error);
        setError("Failed to fetch lottery types");
      }
    };
    fetchLotteryTypes();
  }, []);
  const today = new Date().toISOString().split("T")[0];
  // Fetch shift data when filters change
  useEffect(() => {
    const fetchShiftData = async () => {
      if (!selectedFilterLottery || !selectedSeller) {
        setShiftData(null);
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      setLoading(true);
      setError('');

      try {
        const res = await fetchWithAuth("/seller/shift", {
          method: 'POST',
          body: JSON.stringify({
            lotteryTypeId: selectedFilterLottery,
            sellerId: selectedSeller,
            dateKey: selectedDate
          })
        });
        
        const data = await res.json();
        setShiftData(data.data);
        // Convert shift data to table format
        if (data.data && data.data.sellTickets) {
          const tickets = data.data.sellTickets;
          const formattedNumbers = [];
          
          shifts.forEach(shift => {
            if (tickets[shift] && tickets[shift].length > 0) {
              const numbers = tickets[shift];
              const groups = groupConsecutiveNumbers(numbers);
              
              groups.forEach((group, index) => {
                formattedNumbers.push({
                  id: `${shift}-${index}`,
                  type: getLotteryTypeName(selectedFilterLottery),
                  shift: shift,
                  startNumber: String(group.start).padStart(5, '0'),
                  endNumber: String(group.end).padStart(5, '0'),
                  timestamp: new Date(data.data.createdAt).toLocaleString()
                });
              });
            }
          });
          
          setPreviousNumbers(formattedNumbers);
        }
      } catch (error) {
        console.error("Error fetching shift data:", error);
        setError("No data found for selected filters");
        setShiftData(null);
        setPreviousNumbers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftData();
  }, [selectedFilterLottery, selectedSeller]);

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

  // Get seller info
  const getSelectedSellerInfo = () => {
    return sellers.find(s => s._id === selectedSeller);
  };

  // Add to pending array
  const handleAdd = () => {
    if (!selectedSeller) {
      alert("Please select a seller");
      return;
    }
    if (!selectedLotteryType) {
      alert("Please select a lottery type");
      return;
    }
    if (!selectedShift) {
      alert("Please select a category");
      return;
    }
    if (!startNumber || !endNumber) {
      alert("Please enter both start and end numbers");
      return;
    }
    if (startNumber.length !== 5) {
      alert("Start number must be exactly 5 digits");
      return;
    }
 let adjustedEndNum = endNumber;
    console.log("Start Number:", startNumber, "End Number:", endNumber);
    const endLength = String(endNumber).length;
    if (endLength < 5) {
      const startStr = String(startNumber);
      const prefix = startStr.slice(0, 5 - endLength);
      adjustedEndNum = Number(prefix + String(endNumber));
    }
    console.log("Adjusted End Number:", adjustedEndNum);
    let countNumber =endNumber ? Math.abs(parseInt(adjustedEndNum) - parseInt(startNumber)) + 1 : 1;
    let countLottaryNumber = 0;
    if(selectedShift === "thirtySem"){
      countLottaryNumber = countNumber * 30;
    } else if(selectedShift === "fiveSem"){
      countLottaryNumber = countNumber * 5;
    } else if(selectedShift === "tenSem"){
      countLottaryNumber = countNumber * 10;
    } else if(selectedShift === "hundredSem"){
      countLottaryNumber = countNumber * 100;
    } else if(selectedShift === "twoHundredSem"){ 
      countLottaryNumber = countNumber * 200; 
    } else if(selectedShift === "fiftySem"){
      countLottaryNumber = countNumber * 50;
    }
    if (countLottaryNumber > 2000) {
      alert("Maximum 2000 numbers allowed per entry");
      return;
    }
    

    const newEntry = {
      id: Date.now(),
      sellerId: selectedSeller,
      sellerName: sellers.find(s => s._id === selectedSeller)?.name,
      lotteryTypeId: selectedLotteryType,
      lotteryTypeName: lotteryTypes.find(l => l._id === selectedLotteryType)?.name,
      category: selectedShift,
      startNumber: startNumber.padStart(5, '0'),
      endNumber: endNumber,
      count: countLottaryNumber,
      numCount: countNumber,
    };

    setPendingEntries([...pendingEntries, newEntry]);
    setStartNumber('');
    setEndNumber('');
  };

  // Submit all pending entries
  const handleSubmitAll = async () => {
    if (pendingEntries.length === 0) {
      alert("No entries to submit");
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const entry of pendingEntries) {
        //        try {
        //          await fetchWithAuth("/seller/addNumberToSeller", {
        //           method: 'POST',
        //           body: JSON.stringify({
        //             sellerId: entry.sellerId,
        //             lotteryTypeId: entry.lotteryTypeId,
        //             startNumber: entry.startNumber,
        //             endNumber: entry.endNumber,
        //             category: entry.category
        //           })
        //         });
        //        } catch (error) {
        //   console.error("Error adding entry:", error);
        //   let errorMsg = "Failed to add entry";
        //   try {
        //     const errorData = await error.json?.();
        //     errorMsg = errorData?.error || errorMsg;
        //   } catch {}
        //   alert(`❌ ${errorMsg} for range ${entry.startNumber} - ${entry.endNumber}`);
        // }
        try {
          const response = await fetchWithAuth("/seller/addNumberToSeller", {
            method: 'POST',
            body: JSON.stringify({
              sellerId: entry.sellerId,
              lotteryTypeId: entry.lotteryTypeId,
              startNumber: entry.startNumber,
              endNumber: entry.endNumber,
              category: entry.category,
              today: selectedDate,
            })
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            throw new Error(data.error || "Failed to add entry");
          }
        } catch (error) {
          console.error("Error adding entry:", error);
          const errorMsg = error.message || "Failed to add entry";
          alert(`❌ ${errorMsg} for range ${entry.startNumber} - ${entry.endNumber}`);
          throw error; // Re-throw to stop the loop
        }


      }

      alert(`✅ ${pendingEntries.length} entries added successfully!`);
      setPendingEntries([]);
      setSelectedShift('');
      
      if (selectedFilterLottery === selectedLotteryType) {
        const refreshRes = await fetchWithAuth("/seller/shift", {
          method: 'POST',
          body: JSON.stringify({
            lotteryTypeId: selectedFilterLottery,
            sellerId: selectedSeller,
            dateKey: today
          })
        });
        const refreshData = await refreshRes.json();
        setShiftData(refreshData.data);
      }
    } catch (err) {
      console.error("Error adding numbers:", err);
      const errorMsg = err.response?.data?.error || "Something went wrong";
      alert(`❌ ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleAdd();
      // Focus back to start number input
      setTimeout(() => {
        document.querySelector('input[placeholder="00001"]')?.focus();
      }, 0);
    }
  };

  // Remove entry from pending
  const removeEntry = (id) => {
    setPendingEntries(pendingEntries.filter(entry => entry.id !== id));
  };

  const sellerInfo = getSelectedSellerInfo();

  const apiUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lottery Management System</h1>
          <p className="text-gray-600">Manage lottery tickets and track sales efficiently</p>
          <p className="text-gray-600">{today}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Seller Selection */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seller Selection</h2>
            
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seller
                </label>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a seller...</option>
                  {sellers.map(seller => (
                    <option key={seller._id} value={seller._id}>
                      {seller.name}
                    </option>
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
              

              {sellerInfo && (
                <div className="flex items-center gap-3">
                  {sellerInfo.sellerImage && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={`${apiUrl}/${sellerInfo.sellerImage}`}
                        alt={sellerInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{sellerInfo.name}</p>
                    <p className="text-sm text-gray-500">{sellerInfo.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Number Range */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Number Range</h2>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lottery Type
                  </label>
                  <select
                    value={selectedLotteryType}
                    onChange={(e) => setSelectedLotteryType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {lotteryTypes.map(type => (
                      <option key={type._id} value={type._id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Number
                  </label>
                  <input
                    type="text"
                    value={startNumber}
                    onChange={(e) => setStartNumber(e.target.value)}
                    placeholder="00001"
                    maxLength="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Number
                  </label>
                  <input
                    type="text"
                    value={endNumber}
                    onChange={(e) => setEndNumber(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="00100"
                    maxLength="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  {/* <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    Add
                  </button> */}
                  {pendingEntries.length > 0 && (
                    <button
                      onClick={handleSubmitAll}
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : `Submit (${pendingEntries.length})`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Entries Table */}
            {pendingEntries.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Pending Entries ({pendingEntries.length})
                  </h3>
                  <p className="text-sm text-gray-500">Press Tab to add more entries</p>
                </div>
                
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lottery Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LottaryCount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingEntries.map((entry, index) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.sellerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.lotteryTypeName}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {entry.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{entry.startNumber}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{entry.endNumber}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{entry.count}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{entry.numCount}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => removeEntry(entry.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">View Lottery Numbers</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Lottery Type to View
              </label>
              <select
                value={selectedFilterLottery}
                onChange={(e) => setSelectedFilterLottery(e.target.value)}
                className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {lotteryTypes.map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>

            {loading && (
              <div className="text-center py-8 text-gray-500">
                Loading...
              </div>
            )}

            {selectedFilterLottery && !loading && previousNumbers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Numbers Added Today
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Number
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            End Number
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Count
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previousNumbers.map((number) => {
                          const count = parseInt(number.endNumber) - parseInt(number.startNumber) + 1;
                          return (
                            <tr key={number.id} className="hover:bg-gray-50">
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
                              <td className="py-2 px-3 text-sm text-gray-400">{number.timestamp}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedFilterLottery && !loading && previousNumbers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No numbers added today for this lottery type
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}