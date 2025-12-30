/**
 * API Configuration
 * Cấu hình base URL và các settings cho API
 */

// Thay đổi URL này thành API endpoint của bạn
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://your-api.com/api';

// Thời gian timeout cho mỗi request (ms)
const REQUEST_TIMEOUT = 30000;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: REQUEST_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
