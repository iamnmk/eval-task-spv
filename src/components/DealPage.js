import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const DealPage = () => {
  const { id: spvId } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spvData, setSpvData] = useState(null);

  const fetchSPVData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('spv_basic_info')
        .select('*')
        .eq('id', spvId)
        .single();

      if (error) throw error;
      setSpvData(data);
    } catch (error) {
      console.error('Error fetching SPV data:', error);
    }
  }, [spvId]);

  const fetchActivities = useCallback(async () => {
    try {
      console.log('Fetching activities for SPV ID:', spvId);
      const { data, error } = await supabase
        .from('spv_activity_log')
        .select('*')
        .eq('spv_id', spvId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      console.log('Fetched activities:', data);
      setActivities(data || []);

      // If no activities exist, create an initial activity
      if (!data || data.length === 0) {
        console.log('No activities found, creating initial activity');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error: insertError } = await supabase
            .from('spv_activity_log')
            .insert({
              spv_id: spvId,
              user_id: user.id,
              action: 'SPV Created',
              new_status: 'draft',
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating initial activity:', insertError);
          } else {
            // Fetch activities again to include the new entry
            fetchActivities();
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchActivities:', error);
    } finally {
      setLoading(false);
    }
  }, [spvId]);

  useEffect(() => {
    console.log('Current activities:', activities);
  }, [activities]);

  const checkUserRole = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has admin role (you'll need to implement this based on your auth system)
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(userData?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }, []);

  useEffect(() => {
    checkUserRole();
    fetchSPVData();
    fetchActivities();
  }, [fetchSPVData, fetchActivities, checkUserRole]);

  const handleStatusChange = async (newStatus) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update spv_basic_info status
      const { error: updateError } = await supabase
        .from('spv_basic_info')
        .update({ status: newStatus })
        .eq('id', spvId);

      if (updateError) throw updateError;

      // Log the activity
      const { error: activityError } = await supabase
        .from('spv_activity_log')
        .insert({
          spv_id: spvId,
          user_id: user.id,
          action: newStatus,
          previous_status: spvData.status,
          new_status: newStatus
        });

      if (activityError) throw activityError;

      // Refresh data
      fetchSPVData();
      fetchActivities();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      // Get the SPV data
      const { data: spvData, error: spvError } = await supabase
        .from('spv_basic_info')
        .select('*')
        .eq('id', spvId)
        .single();

      if (spvError) throw spvError;

      // Get the activities
      const { data: activities, error: activitiesError } = await supabase
        .from('spv_activity_log')
        .select('*')
        .eq('spv_id', spvId)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Create a text content for download
      const content = `SPV Details\n
SPV Name: ${spvData.spv_name}
Company/Fund: ${spvData.company_name}
Status: ${spvData.status}
Created At: ${format(new Date(spvData.created_at), 'MMMM dd, yyyy')}

Activity Log:
${activities.map(activity => `
Date: ${format(new Date(activity.created_at), 'MMMM dd, yyyy')}
Action: ${activity.action}
Status: ${activity.new_status}
`).join('\n')}`;

      // Create a blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${spvData.spv_name}-details.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading SPV data:', error);
      alert('Failed to download SPV data. Please try again.');
    }
  };

  const statusOptions = ['draft', 'submitted', 'in progress'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deal</h1>
        <div className="space-x-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Download option
          </button>
          {!isAdmin && (
            <button
              onClick={() => navigate(`/spv-setup/${spvId}`)}
              className="px-4 py-2 bg-green-900 text-white rounded-md hover:bg-green-800"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Activity Log</h2>
          {activities.length === 0 && !loading && (
            <p className="text-gray-500 text-sm mt-2">No activities found</p>
          )}
        </div>
        {activities.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(activity.created_at), 'MMMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin ? (
                        <select
                          value={activity.new_status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${activity.new_status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                          ${activity.new_status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                          ${activity.new_status === 'in progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {activity.new_status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealPage;
