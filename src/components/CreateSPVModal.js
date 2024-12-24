import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function CreateSPVModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    transactionType: '',
    instrumentList: '',
    allocation: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format allocation as a number
      const allocationValue = parseFloat(formData.allocation.replace(/[^0-9.]/g, ''));
      
      const spvData = {
        company_name: formData.companyName,
        transaction_type: formData.transactionType,
        instrument_list: formData.instrumentList,
        allocation: allocationValue
      };

      console.log('Attempting to insert SPV data:', spvData);

      const { data, error } = await supabase
        .from('spvs')
        .insert(spvData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to create SPV');
      }

      console.log('Successfully created SPV:', data);
      onClose();
      navigate('/spv-setup', { state: { spvId: data.id } });
    } catch (error) {
      console.error('Error creating SPV:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create a new SPV</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company/Fund
            </label>
            <input
              type="text"
              placeholder="e.g. ABC Company"
              className="w-full p-2 border rounded-lg"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select
              className="w-full p-2 border rounded-lg bg-white"
              value={formData.transactionType}
              onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">Select Transaction Type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Direct">Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrument List
            </label>
            <select
              className="w-full p-2 border rounded-lg bg-white"
              value={formData.instrumentList}
              onChange={(e) => setFormData({ ...formData, instrumentList: e.target.value })}
              required
              disabled={loading}
            >
              <option value="">Select Instrument List</option>
              <option value="Common">Common</option>
              <option value="Preferred">Preferred</option>
              <option value="SAFE">SAFE</option>
              <option value="Convertible Note">Convertible Note</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="text"
                placeholder="type allocation"
                className="w-full p-2 pl-6 border rounded-lg"
                value={formData.allocation}
                onChange={(e) => {
                  // Only allow numbers and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setFormData({ ...formData, allocation: value });
                }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3B36] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Begin SPV Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
