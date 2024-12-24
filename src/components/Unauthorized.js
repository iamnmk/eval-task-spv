import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="px-4 py-2 bg-[#1B3B36] text-white rounded hover:bg-opacity-90"
        >
          Back to Vehicles
        </button>
      </div>
    </div>
  );
}
