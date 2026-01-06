/**
 * API Configuration
 * Cấu hình base URL và các settings cho API
 */

import { getApiUrl, logNetworkConfig } from './network';

// Log network config khi app khởi động
logNetworkConfig();

// Lấy API URL từ network config
const API_BASE_URL = getApiUrl();

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
