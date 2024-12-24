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
      
      // Fetch from spvs table first
      const { data: spvsData, error: spvsError } = await supabase
        .from('spvs')
        .select(`
          id,
          company_name,
          transaction_type,
          instrument_list,
          allocation,
          status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (spvsError) {
        console.error('Error fetching SPVs:', spvsError);
        throw spvsError;
      }

      // Then fetch corresponding basic info
      const { data: basicInfoData, error: basicInfoError } = await supabase
        .from('spv_basic_info')
        .select('*')
        .in('id', spvsData.map(spv => spv.id));

      if (basicInfoError) {
        console.error('Error fetching basic info:', basicInfoError);
        throw basicInfoError;
      }

      // Transform the data to match our component's expectations
      const transformedData = spvsData.map(spv => {
        const basicInfo = basicInfoData.find(info => info.id === spv.id);
        return {
          ...spv,
          spv_basic_info: basicInfo || {
            id: spv.id,
            spv_name: `${spv.company_name} SPV`,
            company_name: spv.company_name,
            status: spv.status
          }
        };
      });

      console.log('Transformed data:', transformedData);
      setSpvs(transformedData);
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

  const handleCreateSPV = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Vehicles</h1>
        <div className="flex space-x-4 border-b border-gray-200">
          <button className="px-4 py-2 border-b-2 border-green-900 text-green-900 font-medium">
            Twelled SPVs
          </button>
          <button className="px-4 py-2 text-gray-500">
            Venture Twelledy
          </button>
          <button className="px-4 py-2 text-gray-500">
            CapRolls
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Twelled SPVs</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-900"
              />
              <svg
                className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-900 text-white rounded-md hover:bg-green-800 flex items-center"
            >
              <span className="mr-2">+</span>
              Create SPVs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPV Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPV Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company/Fund</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrument List</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
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
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                        {spv.spv_basic_info?.spv_name?.charAt(0) || 'S'}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {spv.spv_basic_info?.spv_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      {spv.spv_basic_info?.company_name?.charAt(0) || 'C'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${spv.spv_basic_info?.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                      ${spv.spv_basic_info?.status === 'In Active' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${spv.spv_basic_info?.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {spv.spv_basic_info?.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {spv.spv_basic_info?.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                      {spv.transaction_type || 'Investment'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {spv.instrument_list || 'Equity'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(spv.allocation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add back the CreateSPVModal */}
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
