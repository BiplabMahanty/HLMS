import React from 'react';

const PreviousNumbersTable = ({ numbers }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Numbers</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
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
                  Added At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {numbers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-sm text-gray-400">
                    No previous numbers added yet
                  </td>
                </tr>
              ) : (
                numbers.map((number) => (
                  <tr key={number.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {number.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">{number.shift}</td>
                    <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.startNumber}</td>
                    <td className="py-2 px-3 text-sm text-gray-600 font-mono">{number.endNumber}</td>
                    <td className="py-2 px-3 text-sm text-gray-400">{number.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PreviousNumbersTable;