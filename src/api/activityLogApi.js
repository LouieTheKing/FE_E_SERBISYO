import axios from '../axios';

export const getAllActivityLogs = async ({
  page = 1,
  sort_by = 'created_at',
  order = 'desc',
  search = '',
  module = ''
} = {}) => {
  try {
    const response = await axios.get('/activitylogs', {
      params: {
        page,
        sort_by,
        order,
        search,
        module
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Activity Logs Error:', error);
    throw error.response?.data?.message || 'Failed to fetch activity logs';
  }
};
 