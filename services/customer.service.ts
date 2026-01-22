/**
 * Customer Service
 * Xử lý các API liên quan đến khách hàng
 */

import { apiService } from './api.service';

export interface Customer {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
  createdAt?: string;
}

class CustomerService {
  /**
   * Lấy danh sách tất cả khách hàng
   */
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<Customer[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);

      if (response.error) {
        console.error('Get customers error:', response.error);
        return [];
      }

      return response.data?.customers || response.data || [];
    } catch (error: any) {
      console.error('Get customers error:', error);
      return [];
    }
  }

  /**
   * Lấy chi tiết khách hàng
   */
  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const response = await apiService.get(`/customers/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get customer by id error:', error);
      return null;
    }
  }

  /**
   * Cập nhật khách hàng
   */
  async updateCustomer(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer | null> {
    try {
      const response = await apiService.put(`/customers/${id}`, updates);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Update customer error:', error);
      return null;
    }
  }

  /**
   * Xóa khách hàng
   */
  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/customers/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return true;
    } catch (error: any) {
      console.error('Delete customer error:', error);
      return false;
    }
  }
}

export default new CustomerService();
