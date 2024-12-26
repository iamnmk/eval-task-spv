import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Check, Clock, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status, isAdmin, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusOptions = ['Draft', 'Submitted', 'In Review', 'Approved', 'Rejected'];

  const handleStatusClick = async (newStatus) => {
    if (onStatusChange) {
      await onStatusChange(newStatus.toLowerCase());
      setIsOpen(false);
    }
  };

  const badge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
            <Check size={14} />
            <span className="text-sm">Approved</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
            <Check size={14} />
            <span className="text-sm">Submitted</span>
          </div>
        );
      case 'in review':
        return (
          <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full w-fit">
            <Clock size={14} />
            <span className="text-sm">In Review</span>
          </div>
        );
      case 'draft':
      default:
        return (
          <div className="flex items-center space-x-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full w-fit">
            <span className="text-sm">Draft</span>
          </div>
        );
        case 'rejected':
        return (
          <div className="flex items-center space-x-1 text-gray-600 bg-red-50 px-2 py-1 rounded-full w-fit">
            <span className="text-sm">Rejected</span>
          </div>
        );
    }
  };

  if (!isAdmin) {
    return badge(status);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 cursor-pointer"
      >
        {badge(status)}
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleStatusClick(option)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DealPage = () => {
  const { spvId } = useParams();
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
    try {
      // Update the SPV status
      const { error: updateError } = await supabase
        .from('spv_basic_info')
        .update({ status: newStatus })
        .eq('id', spvId);

      if (updateError) throw updateError;

      // Add activity log entry
      const { data: { user } } = await supabase.auth.getUser();
      const { error: logError } = await supabase
        .from('spv_activity_log')
        .insert({
          spv_id: spvId,
          user_id: user.id,
          action: 'Status Updated',
          new_status: newStatus,
          created_at: new Date().toISOString()
        });

      if (logError) throw logError;

      // Refresh data
      await fetchSPVData();
      await fetchActivities();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getUserDisplay = (userId, userEmail) => {
    return userEmail === 'admin@twelled.com' ? 'Admin' : (users[userId] || 'User');
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Deal</h1>
        <div className="space-x-3">
          <button
            onClick={handleDownload}
            className="text-gray-600 hover:text-gray-800"
          >
            Download option
          </button>
          {!isAdmin && (
            <button
              onClick={() => navigate(`/spv-setup/${spvId}`)}
              className="px-3 py-1.5 bg-[#1B3B36] text-white text-sm rounded hover:bg-opacity-90"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <div className="p-6">
          <h2 className="text-base font-semibold mb-6">Twelled SPVs</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-2 font-medium text-gray-500">Date</th>
                <th className="text-left py-2 font-medium text-gray-500">Action</th>
                <th className="text-left py-2 font-medium text-gray-500">By</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4 text-sm">
                    {format(new Date(activity.created_at), 'MMMM d, yyyy')}
                  </td>
                  <td className="py-4">
                    <StatusBadge 
                      status={activity.new_status}
                      isAdmin={isAdmin}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                  <td className="py-4 text-sm">
                    {getUserDisplay(activity.user_id, users[activity.user_id])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealPage;
