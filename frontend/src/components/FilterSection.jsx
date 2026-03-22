import React from 'react';

const FilterSection = ({ onFilterChange, filteredNumbers, selectedType }) => {
  const lotteryTypes = ['Daily', 'Weekly', 'Monthly', 'Special'];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Type</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Lottery Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onFilterChange(e.target.value)}
          className="max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {lotteryTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {selectedType && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {selectedType} Lottery Numbers
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Number
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Number
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Range Count
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredNumbers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-sm text-gray-400">
                        No numbers found for {selectedType} lottery
                      </td>
                    </tr>
                  ) : (
                    filteredNumbers.map((number) => {
                      const rangeCount = parseInt(number.endNumber) - parseInt(number.startNumber) + 1;
                      return (
                        <tr key={number.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm text-gray-600">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {number.shift}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.startNumber}</td>
                          <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.endNumber}</td>
                          <td className="py-2 px-3 text-sm text-gray-600 font-semibold">{rangeCount}</td>
                          <td className="py-2 px-3 text-sm text-gray-400">{number.timestamp}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;