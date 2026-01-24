/**
 * Payment Service
 * Xử lý các chức năng thanh toán qua ngân hàng
 */

import { CartItem } from '@/context/CartContext';
import { apiService } from './api.service';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'e_wallet' | 'cod';
  icon: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress?: string;
  phoneNumber?: string;
  notes?: string;
}

export interface OrderResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  qrCode?: string;
  bankTransferInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    content: string;
  };
  createdAt: string;
}

export interface PaymentStatus {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paidAt?: string;
  transactionId?: string;
}

class PaymentService {
  /**
   * Danh sách phương thức thanh toán
   */
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'hdbank',
        name: 'HD Bank',
        type: 'bank_transfer',
        icon: '🏦',
        bankCode: 'HDB',
        accountNumber: '1234567890',
        accountName: 'CONG TY TNHH TECH STORE',
      },
      {
        id: 'cod',
        name: 'Thanh toán khi nhận hàng (COD)',
        type: 'cod',
        icon: '💵',
      },
    ];
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await apiService.post('/orders/create', orderData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Create order error:', error);
      throw new Error(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await apiService.get(`/orders/${orderId}/payment-status`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Check payment status error:', error);
      throw new Error(error.message || 'Không thể kiểm tra trạng thái thanh toán.');
    }
  }

  /**
   * Tạo QR code thanh toán
   */
  generateBankQRCode(
    bankCode: string,
    accountNumber: string,
    accountName: string,
    amount: number,
    content: string
  ): string {
    // Sử dụng VietQR API để tạo QR code
    const baseUrl = 'https://img.vietqr.io/image';
    const params = new URLSearchParams({
      accountNo: accountNumber,
      accountName: accountName,
      amount: amount.toString(),
      addInfo: content,
    });

    return `${baseUrl}/${bankCode}-${accountNumber}-compact2.jpg?${params.toString()}`;
  }

  /**
   * Chuyển đổi cart items sang order items
   */
  convertCartToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
  }

  /**
   * Tạo nội dung chuyển khoản
   */
  generateTransferContent(orderCode: string): string {
    return `TT ${orderCode}`;
  }

  /**
   * Lấy danh sách đơn hàng của user
   */
  async getUserOrders(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await apiService.get(`/orders?page=${page}&limit=${limit}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get user orders error:', error);
      throw new Error(error.message || 'Không thể tải danh sách đơn hàng.');
    }
  }

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderDetail(orderId: string): Promise<any> {
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get order detail error:', error);
      throw new Error(error.message || 'Không thể tải thông tin đơn hàng.');
    }
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId: string, reason?: string): Promise<any> {
    try {
      const response = await apiService.post(`/orders/${orderId}/cancel`, { reason });
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Cancel order error:', error);
      throw new Error(error.message || 'Không thể hủy đơn hàng.');
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
