import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CreateSPVModal from './CreateSPVModal';

const Vehicles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spvs, setSpvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSPVs();
  }, []);

  useEffect(() => {
    console.log('Current SPVs state:', spvs);
  }, [spvs]);

  const fetchSPVs = async () => {
    try {
      console.log('Fetching SPVs...');
      
      // Fetch SPVs
      const { data: spvsData, error: spvsError } = await supabase
        .from('spvs')
        .select('*')
        .order('created_at', { ascending: false });

      if (spvsError) {
        console.error('Error fetching SPVs:', spvsError);
        throw spvsError;
      }

      // Fetch basic info for all SPVs
      const { data: basicInfoData, error: basicInfoError } = await supabase
        .from('spv_basic_info')
        .select('*');

      if (basicInfoError) {
        console.error('Error fetching basic info:', basicInfoError);
        throw basicInfoError;
      }

      // Combine the data
      const combinedData = spvsData.map(spv => ({
        ...spv,
        spv_basic_info: basicInfoData.find(info => info.id === spv.id) || null
      }));

      console.log('Combined data:', combinedData);
      setSpvs(combinedData || []);
    } catch (error) {
      console.error('Error in fetchSPVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRowClick = (spvId) => {
    navigate(`/deal/${spvId}`);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">SPV Vehicles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Create New SPV
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search SPVs..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Logo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SPV Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company/Fund
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument List
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {spvs.map((spv) => (
              <tr
                key={spv.id}
                onClick={() => handleRowClick(spv.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {spv.spv_basic_info?.company_name?.charAt(0) || 'C'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {spv.spv_basic_info?.spv_name || 'Untitled SPV'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {spv.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {spv.spv_basic_info?.company_name || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(spv.spv_basic_info?.status)}`}>
                    {spv.spv_basic_info?.status || 'draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {spv.transaction_type || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {spv.instrument_list || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(spv.allocation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateSPVModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Vehicles;
