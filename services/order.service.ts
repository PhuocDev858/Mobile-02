/**
 * Order Service
 * Xử lý các API liên quan đến đơn hàng
 */

import { apiService } from './api.service';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  id?: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

class OrderService {
  /**
   * Lấy danh sách tất cả đơn hàng
   */
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<Order[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);

      if (response.error) {
        console.error('Get orders error:', response.error);
        return [];
      }

      return response.data?.orders || response.data || [];
    } catch (error: any) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await apiService.get(`/orders/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get order by id error:', error);
      return null;
    }
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(order: Omit<Order, '_id' | 'id'>): Promise<Order | null> {
    try {
      const response = await apiService.post('/orders', order);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Create order error:', error);
      return null;
    }
  }

  /**
   * Cập nhật đơn hàng
   */
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      const response = await apiService.put(`/orders/${id}`, updates);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Update order error:', error);
      return null;
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(
    id: string,
    status: Order['status']
  ): Promise<Order | null> {
    try {
      const response = await apiService.put(`/orders/${id}`, { status });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Update order status error:', error);
      return null;
    }
  }

  /**
   * Xóa đơn hàng
   */
  async deleteOrder(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/orders/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return true;
    } catch (error: any) {
      console.error('Delete order error:', error);
      return false;
    }
  }
}

export default new OrderService();
