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
  resetToken: string;  // OTP/Token từ backend
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
    }, {}, true); // skipAuth = true
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string) {
    return apiService.post('/auth/verify-otp', {
      email,
      otp,
    }, {}, true); // skipAuth = true
  }

  /**
   * Đặt lại mật khẩu (OTP 6 chữ số)
   * Lưu ý: Backend sẽ check resetToken field, nhưng chúng ta sử dụng OTP làm token
   */
  async resetPassword(data: ResetPasswordRequest) {
    const payload = {
      resetToken: data.resetToken,  // Frontend sử dụng OTP làm resetToken
      email: data.email,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
    console.log('🔑 Reset Password Request Payload:', JSON.stringify(payload, null, 2));
    return apiService.post('/auth/reset-password', payload, {}, true); // skipAuth = true
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

  /**
   * Cập nhật hồ sơ người dùng
   */
  async updateProfile(data: UpdateProfileRequest) {
    return apiService.put('/auth/profile', {
      fullName: data.fullName,
    });
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(data: ChangePasswordRequest) {
    return apiService.post('/auth/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  }
}

export const authService = new AuthService();
