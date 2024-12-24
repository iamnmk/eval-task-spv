import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download, Edit } from 'lucide-react';

export default function DealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spv, setSpv] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDealData = useCallback(async () => {
    try {
      // Fetch SPV details
      const { data: spvData, error: spvError } = await supabase
        .from('spv_basic_info')
        .select('*')
        .eq('id', id)
        .single();

      if (spvError) throw spvError;
      setSpv(spvData);

      // Fetch activity log
      const { data: logData, error: logError } = await supabase
        .from('spv_activity_log')
        .select(`
          id,
          created_at,
          action,
          previous_status,
          new_status,
          user_id,
          users:user_id (
            email
          )
        `)
        .eq('spv_id', id)
        .order('created_at', { ascending: false });

      if (logError) throw logError;
      console.log('Activity log data:', logData); // Debug log
      setActivityLog(logData || []);
    } catch (error) {
      console.error('Error fetching deal data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDealData();
  }, [fetchDealData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3B36]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{spv?.spv_name}</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5" />
            <span>Download option</span>
          </button>
          <button 
            onClick={() => navigate(`/spv-setup/${id}/edit`)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1B3B36] text-white rounded-lg hover:bg-[#152b28]"
          >
            <Edit className="h-5 w-5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Twelled SPVs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">By</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No activity recorded yet
                  </td>
                </tr>
              ) : (
                activityLog.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="py-3 px-4">
                      {new Date(log.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {log.action === 'status_change' 
                        ? `Status changed from ${log.previous_status || 'draft'} to ${log.new_status}`
                        : log.action}
                    </td>
                    <td className="py-3 px-4">{log.users?.email || 'System'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
