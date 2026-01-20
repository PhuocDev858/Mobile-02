/**
 * Auth Service
 * Xử lý các API liên quan đến xác thực
 */

import { apiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  /**
   * Đăng nhập
   */
  async login(credentials: LoginRequest) {
    const response = await apiService.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('Login response:', response);
    // Token có thể nằm ở response.data.token hoặc response.data.data.token
    const token = response.data?.token || (response.data as any)?.data?.token;
    
    if (token) {
      console.log('Saving token:', token.substring(0, 30) + '...');
      await apiService.setToken(token);
      const savedToken = await apiService.getToken();
      console.log('Token saved successfully:', savedToken ? 'Yes' : 'No');
    } else {
      console.log('No token in response');
    }

    return response;
  }

  /**
   * Đăng ký
   */
  async signup(data: SignupRequest) {
    return apiService.post<LoginResponse>('/auth/signup', {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Quên mật khẩu
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    return apiService.post('/auth/forgot-password', {
      email: data.email,
    });
  }

  /**
   * Đặt lại mật khẩu
   */
  async resetPassword(data: ResetPasswordRequest) {
    return apiService.post('/auth/reset-password', {
      token: data.token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  }

  /**
   * Đăng xuất
   */
  async logout() {
    await apiService.removeToken();
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser() {
    return apiService.get('/auth/me');
  }
}

export const authService = new AuthService();
