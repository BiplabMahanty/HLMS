import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShoppingCart, FiFileText, FiTrash2 } = FiIcons;

const TicketSummary = () => {
  const summaryData = [
    {
      title: 'Sell Tickets',
      value: '1,245',
      icon: FiShoppingCart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Tickets',
      value: '5,678',
      icon: FiFileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Delete Tickets',
      value: '23',
      icon: FiTrash2,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ticket Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryData.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-6 border cursor-pointer hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
              </div>
              <div className={`${item.color} p-3 rounded-lg`}>
                <SafeIcon icon={item.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketSummary;