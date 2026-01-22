/**
 * Product Service
 * Xử lý các API liên quan đến sản phẩm
 */

import { Product } from '@/data/products';
import { apiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

class ProductService {
  /**
   * Lấy danh sách tất cả sản phẩm
   */
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }): Promise<ProductListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get all products error:', error);
      throw new Error(error.message || 'Không thể tải danh sách sản phẩm.');
    }
  }

  /**
   * Lấy sản phẩm nổi bật (featured products)
   */
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      const response = await apiService.get(`/products/featured?limit=${limit}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get featured products error:', error);
      throw new Error(error.message || 'Không thể tải sản phẩm nổi bật.');
    }
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiService.get(`/products/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      // Backend trả về {data: {...}, success, message}, cần lấy data bên trong
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Get product by ID error:', error);
      throw new Error(error.message || 'Không thể tải thông tin sản phẩm.');
    }
  }

  /**
   * Lấy danh sách categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get('/categories');

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Get categories error:', error);
      throw new Error(error.message || 'Không thể tải danh mục sản phẩm.');
    }
  }

  /**
   * Tìm kiếm sản phẩm
   */
  async searchProducts(query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ProductListResponse> {
    try {
      return await this.getAllProducts({
        ...params,
        search: query,
      });
    } catch (error: any) {
      console.error('Search products error:', error);
      throw new Error(error.message || 'Không thể tìm kiếm sản phẩm.');
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(product: any): Promise<Product | null> {
    try {
      const response = await apiService.post('/products', product);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Create product error:', error);
      return null;
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(id: string, updates: any): Promise<Product | null> {
    try {
      const response = await apiService.put(`/products/${id}`, updates);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error: any) {
      console.error('Update product error:', error);
      return null;
    }
  }

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/products/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return true;
    } catch (error: any) {
      console.error('Delete product error:', error);
      return false;
    }
  }
}

const productService = new ProductService();
export default productService;
