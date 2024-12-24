import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import StatusDropdown from './StatusDropdown';

const DealPage = () => {
  const { id: spvId } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spvData, setSpvData] = useState(null);
  const [users, setUsers] = useState({});

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

  const fetchUserDetails = async (userIds) => {
    try {
      // Get the current user's email
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Create a map with the admin email
      const userMap = {
        [currentUser.id]: currentUser.email
      };
      
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

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

      // Fetch user details for all activities
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(activity => activity.user_id))];
        await fetchUserDetails(userIds);
      }

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

  const checkUserRole = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user's email is admin@twelled.com
      setIsAdmin(user.email === 'admin@twelled.com');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }, []);

  useEffect(() => {
    checkUserRole();
    fetchSPVData();
    fetchActivities();
  }, [checkUserRole, fetchSPVData, fetchActivities]);

  const handleStatusChange = async (newStatus) => {
    await fetchSPVData();
    await fetchActivities();
  };

  const getUserDisplay = (userId, userEmail) => {
    return userEmail === 'admin@twelled.com' ? 'Admin' : (users[userId] || 'User');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async () => {
    try {
      const { data: activities, error: activitiesError } = await supabase
        .from('spv_activity_log')
        .select('*')
        .eq('spv_id', spvId)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

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
By: ${getUserDisplay(activity.user_id, users[activity.user_id])}
`).join('\n')}`;

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">By</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserDisplay(activity.user_id, users[activity.user_id])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin ? (
                        <StatusDropdown
                          spvId={spvId}
                          currentStatus={activity.new_status}
                          activity={activity}
                          onStatusChange={handleStatusChange}
                        />
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.new_status)}`}>
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
