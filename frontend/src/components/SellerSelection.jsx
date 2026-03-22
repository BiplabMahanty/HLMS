import React from 'react';

const SellerSelection = ({ sellers, selectedSeller, onSellerChange }) => {
  const selectedSellerData = sellers.find(seller => seller.id.toString() === selectedSeller);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Seller Selection</h2>
      
      <div className="flex items-center gap-6">
        {/* Dropdown */}
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Seller
          </label>
          <select
            value={selectedSeller}
            onChange={(e) => onSellerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a seller...</option>
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>

        {/* Seller Profile Image */}
        {selectedSellerData && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={selectedSellerData.image}
                alt={selectedSellerData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{selectedSellerData.name}</p>
              <p className="text-sm text-gray-500">Active Seller</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSelection;