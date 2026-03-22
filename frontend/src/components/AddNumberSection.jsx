import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

const AddNumberSection = ({ onAddNumber }) => {
  const [formData, setFormData] = useState({
    lotteryType: '',
    shift: '',
    startNumber: '',
    endNumber: ''
  });

  const lotteryTypes = ['Daily', 'Weekly', 'Monthly', 'Special'];
  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    if (formData.lotteryType && formData.shift && formData.startNumber && formData.endNumber) {
      onAddNumber({
        type: formData.lotteryType,
        shift: formData.shift,
        startNumber: formData.startNumber,
        endNumber: formData.endNumber
      });
      
      // Reset form
      setFormData({
        lotteryType: '',
        shift: '',
        startNumber: '',
        endNumber: ''
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Number Range</h2>
      
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Lottery Type Dropdown */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lottery Type
            </label>
            <select
              value={formData.lotteryType}
              onChange={(e) => handleInputChange('lotteryType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              {lotteryTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Shift Dropdown */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift
            </label>
            <select
              value={formData.shift}
              onChange={(e) => handleInputChange('shift', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Shift</option>
              {shifts.map(shift => (
                <option key={shift} value={shift}>{shift}</option>
              ))}
            </select>
          </div>

          {/* Start Number */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Number
            </label>
            <input
              type="text"
              value={formData.startNumber}
              onChange={(e) => handleInputChange('startNumber', e.target.value)}
              placeholder="001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Number */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Number
            </label>
            <input
              type="text"
              value={formData.endNumber}
              onChange={(e) => handleInputChange('endNumber', e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add Button */}
          <div>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNumberSection;