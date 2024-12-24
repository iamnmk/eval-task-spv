import React from 'react';
import { supabase, adminSupabase } from '../lib/supabase';

const StatusDropdown = ({ spvId, currentStatus, onStatusChange }) => {
  const statusOptions = ['draft', 'approved', 'rejected', 'in progress'];

  const handleStatusChange = async (newStatus) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'admin@twelled.com') {
        alert('Only admin can change the status.');
        return;
      }

      // Use adminSupabase for status updates
      const { error: updateError } = await adminSupabase
        .from('spv_basic_info')
        .update({ status: newStatus })
        .eq('id', spvId);

      if (updateError) throw updateError;

      // Log the activity using adminSupabase
      const { error: activityError } = await adminSupabase
        .from('spv_activity_log')
        .insert({
          spv_id: spvId,
          user_id: user.id,
          action: `Status changed to ${newStatus}`,
          previous_status: currentStatus,
          new_status: newStatus,
          created_at: new Date().toISOString()
        });

      if (activityError) throw activityError;

      // Call the parent's onStatusChange callback
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-800 bg-green-100';
      case 'rejected':
        return 'text-red-800 bg-red-100';
      case 'in progress':
        return 'text-yellow-800 bg-yellow-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${getStatusColor(currentStatus)}`}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status} className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
