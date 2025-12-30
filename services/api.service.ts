/**
 * API Service
 * Xử lý tất cả các HTTP requests
 */

import API_CONFIG from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private baseUrl: string = API_CONFIG.BASE_URL;
  private timeout: number = API_CONFIG.TIMEOUT;

  /**
   * Lấy token từ localStorage
   */
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Chuẩn bị headers cho request
   */
  private async prepareHeaders(customHeaders?: Record<string, string>) {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      ...API_CONFIG.HEADERS,
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Thực hiện HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.prepareHeaders(config.headers);
      const method = config.method || 'GET';
      const timeout = config.timeout || this.timeout;

      const options: RequestInit = {
        method,
        headers,
      };

      if (config.body) {
        options.body = JSON.stringify(config.body);
      }

      // Sử dụng AbortController để handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      console.log(`🚀 API Request: ${method} ${url}`, config.body);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      console.log(`📦 API Response [${response.status}]:`, data);

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`, data?.message);
        return {
          error: data?.message || `HTTP Error: ${response.status}`,
          status: response.status,
          data: null,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error: any) {
      console.error(`❌ API Error [${endpoint}]:`, error.message);

      return {
        error: error.message || 'Network error occurred',
        status: 0,
        data: null,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ) {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ) {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ) {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  /**
   * Lưu token sau khi đăng nhập
   */
  async setToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Xóa token sau khi đăng xuất
   */
  async removeToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}

export const apiService = new ApiService();
