import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CreateSPVModal from './CreateSPVModal';

function StatusBadge({ status }) {
  const colors = {
    Active: 'bg-emerald-100 text-emerald-800',
    'In Active': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm ${colors[status] || ''}`}>
      {status}
    </span>
  );
}

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState('Twelled SPVs');
  const [spvs, setSpvs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSPVs();
  }, []);

  const fetchSPVs = async () => {
    try {
      // First, let's check what data we have in spvs table
      const { data, error } = await supabase
        .from('spvs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(spv => ({
        id: spv.id,
        spvName: spv.company_name, // temporarily using company_name as spv_name
        companyName: spv.company_name,
        status: 'Active',
        transactionType: spv.transaction_type || '',
        instrumentType: spv.instrument_list || '',
        allocation: spv.allocation || 0
      }));

      setSpvs(formattedData);
    } catch (error) {
      console.error('Error fetching SPVs:', error);
    }
  };

  const filteredSPVs = spvs.filter(spv => 
    spv.spvName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spv.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Vehicles</h1>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          {['Twelled SPVs', 'Venture Twelledy', 'CapRolls'].map(tab => (
            <button
              key={tab}
              className={`pb-4 px-2 ${
                activeTab === tab
                  ? 'border-b-2 border-[#1B3B36] text-[#1B3B36] font-medium'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Create */}
      <div className="flex justify-between mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1B3B36] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create SPVs</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SPV Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company/logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SPV Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company/Fund
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument List
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSPVs.map((spv, index) => (
              <tr key={spv.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 mr-3"></div>
                    {spv.spvName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={spv.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {spv.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                    {spv.transactionType || 'Investment'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {spv.instrumentType || 'Equity'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${Number(spv.allocation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateSPVModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
