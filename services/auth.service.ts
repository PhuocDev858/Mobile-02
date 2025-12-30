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
  email: string;
  password: string;
  name: string;
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
    const response = await apiService.post<LoginResponse>('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data?.token) {
      await apiService.setToken(response.data.token);
    }

    return response;
  }

  /**
   * Đăng ký
   */
  async signup(data: SignupRequest) {
    return apiService.post<LoginResponse>('/signup', {
      email: data.email,
      password: data.password,
      name: data.name,
    });
  }

  /**
   * Quên mật khẩu
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    return apiService.post('/forgot-password', {
      email: data.email,
    });
  }

  /**
   * Đặt lại mật khẩu
   */
  async resetPassword(data: ResetPasswordRequest) {
    return apiService.post('/reset-password', {
      token: data.token,
      password: data.password,
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
    return apiService.get('/me');
  }
}

export const authService = new AuthService();
