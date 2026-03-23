import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from '../components/Toast';

export default function Payment() {
  const { showToast,showSuccessToast,showWarningToast } = useToast();
  const [sellers, setSellers] = useState([]);
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningTypeId, setMorningTypeId] = useState('');
  const [dayTypeId, setDayTypeId] = useState('');
  const [nightTypeId, setNightTypeId] = useState('');
  const [morningData, setMorningData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [nightData, setNightData] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [vouter, setVouter] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [morningType, setMorningType] = useState("");
  const [dayType, setDayType] = useState("");
  const [nightType, setNightType] = useState("");
  const[morning,setMorningDate]=useState(new Date().toISOString().split('T')[0])
  const[day,setDayDate]=useState(new Date().toISOString().split('T')[0])
  const[night,setNightDate]=useState(new Date().toISOString().split('T')[0])
  const [paymentDetails, setPaymentDetails] = useState({});
  const [priviousDatePayments, setPriviosuDatePayments] = useState({});
  console.log("Selected Seller:", selectedSeller);
  console.log("Selected Date:", selectedDate);
  console.log("Morning Type ID:", morningTypeId);
  console.log("Day Type ID:", dayTypeId);
  console.log("Night Type ID:", nightTypeId);
  console.log("Morning Data:", morning);
  console.log("Day Data:", day);
  console.log("Night Data:", night);
  console.log("Payment Details:", paymentDetails);
  console.log("Previous Date Payments:", priviousDatePayments);
  console.log("setMorningType:", morningType);

  useEffect(() => {
    fetchSellers();
    fetchLotteryTypes();
  }, []);

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchShiftData();
    }
  }, [selectedSeller, morning,day,night, morningTypeId, dayTypeId, nightTypeId]);

  const fetchSellers = async () => {
    try {
      const res = await fetchWithAuth('/seller/getseller');
      const data = await res.json();
      setSellers(data.seller || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fecthPriviousDatePayments();
    }
  }, [selectedSeller, selectedDate]);

  const fecthPriviousDatePayments = async () => {
    try {
      const res = await fetchWithAuth(`/seller/previousDatePayments?sellerId=${selectedSeller}&date=${selectedDate}`);
      const data = await res.json();

      setPriviosuDatePayments(data.payments?.[0] || {}); 
      console.log('Previous Date Payments:', data);
    } catch (error) {
      console.error('Error fetching previous date payments:', error);
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
  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchPaymentDetails();
    }
  }, [selectedSeller, selectedDate]);

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetchWithAuth(`/seller/payments?sellerId=${selectedSeller}&date=${selectedDate}`);
      const data = await res.json();
      setPaymentDetails(data.payments?.[0] || {});
      console.log('Payment Details:', data);
    } catch (error) {
      showToast('Failed to fetch payment details. Please try again.');
      console.error('Error fetching payment details:', error);
    }
  };

  const fetchShiftData = async () => {
    try {
      if (morningTypeId) {
        const res = await fetchWithAuth('/seller/shift', {
          method: 'POST',
          body: JSON.stringify({
            lotteryTypeId: morningTypeId,
            sellerId: selectedSeller,
            dateKey: morning
          })
        });
        const data = await res.json();
        setMorningData(data.data);
      }

      if (dayTypeId) {
        const res = await fetchWithAuth('/seller/shift', {
          method: 'POST',
          body: JSON.stringify({
            lotteryTypeId: dayTypeId,
            sellerId: selectedSeller,
            dateKey: day
          })
        });
        const data = await res.json();
        setDayData(data.data);
      }

      if (nightTypeId) {
        const res = await fetchWithAuth('/seller/shift', {
          method: 'POST',
          body: JSON.stringify({
            lotteryTypeId: nightTypeId,
            sellerId: selectedSeller,
            dateKey: night
          })
        });
        const data = await res.json();
        setNightData(data.data);
      }
    } catch (error) {
      console.error('Error fetching shift data:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedSeller) {
      showWarningToast('Please select a seller');
      return;
    }
    if (!morningTypeId || !dayTypeId || !nightTypeId) { 
      showWarningToast('Please select lottery types for all shifts');
      return;
    } 
    if(morningTypeId==dayTypeId || dayTypeId==nightTypeId || nightTypeId==morningTypeId){
      showWarningToast('Please select different lottery types for each shift');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth('/seller/paymentDay', {
        method: 'POST',
        body: JSON.stringify({
          sellerId: selectedSeller,
          typeMorningId: morningTypeId,
          typeDayId: dayTypeId,
          typeNightId: nightTypeId,
          amountPaid: Number(amountPaid) || 0,
          vouter: Number(vouter) || 0,
          paymentMethod,
          note,
          today:selectedDate,
        })
      });

      showSuccessToast('Payment recorded successfully!');
      setAmountPaid('');
      setVouter('');
      setNote('');
      fetchShiftData(); 
      fetchPaymentDetails();
      fecthPriviousDatePayments();
      
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast(error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const getShiftTotal = (shiftData) => {
    if (!shiftData?.sellTickets) return 0;
    return shiftData.sellTickets.totalNumberAmount || 0;
  };
  console.log("paymentDetails.todayRemaining",paymentDetails.todayRemaining)
  const getTotalSubBill = () => {
    if(paymentDetails?.todayBill) return paymentDetails.todayBill;
    return getShiftTotal(morningData) + getShiftTotal(dayData) + getShiftTotal(nightData);
  };
const getTotalBill = () => {
  if(paymentDetails?.todayRemaining) return paymentDetails.todayRemaining;
  const previousDue = priviousDatePayments?.todayRemaining || 0;
  const todayTotal = getShiftTotal(morningData) + getShiftTotal(dayData) + getShiftTotal(nightData);
  return previousDue + todayTotal;
};
// const todayDue = getTotalBill() - (priviousDatePayments.todayRemaining || 0);

  const apiUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  console.log("Total Bill:", getTotalBill());
  const sellerInfo = sellers.find(s => s._id === selectedSeller);

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
              
                <img src={`${apiUrl}/${sellerInfo.sellerImage}`} alt={sellerInfo.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
              )}
              <div>
                <p className="font-medium text-gray-800">{sellerInfo.name}</p>
                <p className="text-sm text-gray-500">{sellerInfo.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Three Divs in Same Line - Morning, Day, Night */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Morning */}
  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-5">
    <h3 className="text-lg font-semibold text-orange-800 mb-3">🌅{morningType || "Select lottary"}</h3>
    <div className="mb-3 flex gap-2">
      <input
        type="date"
        value={morning}
        onChange={(e) => {
          setMorningDate(e.target.value);
          fetchShiftData();
        }}
        className="px-2 py-1.5 text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
      <select
        value={morningTypeId}
  onChange={(e) => {
  const selectedOption = lotteryTypes.find(type => type._id === e.target.value);
  setMorningTypeId(e.target.value);
  setMorningType(selectedOption?.name || ""); // Make sure it's a string, not an object
}}


        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">Select</option>
        {lotteryTypes.map(type => (
          <option key={type._id} value={type._id}>{type.name}</option>
        ))}
      </select>
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

          {/* Day */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-sm border border-blue-200 p-5">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">☀️ {dayType || "Select lottary"}</h3>
            <div className="mb-3 flex gap-2">
              {/* <label className="block text-xs font-medium text-gray-600 mb-1">Lottery Type</label> */}
              <input
                type="date"
                value={day}
                onChange={(e) => (setDayDate(e.target.value), fetchShiftData())}
                className="px-2 py-1.5 text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <select
                value={dayTypeId}
                onChange={(e) => {
                  const selectedOption = lotteryTypes.find(type => type._id === e.target.value);
                  setDayTypeId(e.target.value);
                  setDayType(selectedOption?.name || "");
                }}
                  // setDayTypeId(e.target.value)}}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {lotteryTypes.map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>
            {dayData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">30 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.thirtySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.fiveSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.tenSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">50 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.fiftySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">100 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.hundredSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">200 Sem:</span>
                  <span className="font-semibold">{dayData.sellTickets?.twoHundredSem?.length || 0}</span>
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-between">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="font-bold text-blue-700">₹{getShiftTotal(dayData)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Night */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-5">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">🌙 {nightType || "Select lottary"}</h3>
            <div className="mb-3 flex gap-2">
              {/* <label className="block text-xs font-medium text-gray-600 mb-1">Lottery Type</label> */}
              <input
                type="date"
                value={night}
                onChange={(e) => (setNightDate(e.target.value), fetchShiftData())}
                className="px-2 py-1.5 text-sm border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <select
                value={nightTypeId}
                onChange={(e) =>{
                  const selectedOption = lotteryTypes.find(type => type._id === e.target.value);
                  setNightTypeId(e.target.value);
                  setNightType(selectedOption?.name || "");
                }}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                {lotteryTypes.map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>
            {nightData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">30 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.thirtySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.fiveSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.tenSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">50 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.fiftySem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">100 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.hundredSem?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">200 Sem:</span>
                  <span className="font-semibold">{nightData.sellTickets?.twoHundredSem?.length || 0}</span>
                </div>
                <div className="pt-2 border-t border-indigo-200 flex justify-between">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="font-bold text-indigo-700">₹{getShiftTotal(nightData)}</span>
                </div>
              </div>
            )}
          </div>
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
            {paymentDetails ? (
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold "style={{ color: '#7bc0e3' }}  >Today Due:</span>
                <span className="font-bold text-2xl"style={{ color: '#7bc0e3' }}>
                  ₹{paymentDetails ? (paymentDetails.todayBill || 0) - (paymentDetails.amountPaid || 0)-(paymentDetails.vouter || 0) : 0}
                </span>
              </div>) : null}
             <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-blue-600">Total Due:</span>
              <span className="font-bold text-blue-600 text-2xl">₹{priviousDatePayments.todayRemaining||0}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold "style={{ color: '#824626' }}>Total Subtotal:</span>
              <span className="font-bold text-2xl" style={{ color: '#824626' }}>₹{getTotalSubBill()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold "style={{ color: '#110817' }}>Total Bill:</span>
              <span className="font-bold  text-2xl" style={{ color: '#110817' }}>₹{getTotalBill()}</span>
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
