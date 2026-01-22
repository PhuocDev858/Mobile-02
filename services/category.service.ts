/**
 * Category Service
 * Xử lý các API liên quan đến danh mục sản phẩm
 */

import { apiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  productCount?: number;
  description?: string;
}

class CategoryService {
  /**
   * Lấy danh sách tất cả các danh mục
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get<Category[]>('/categories');
      
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        console.error('Error fetching categories:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async getCategoryDetail(categoryId: string): Promise<Category | null> {
    try {
      const response = await apiService.get<Category>(`/categories/${categoryId}`);
      
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        console.error('Error fetching category detail:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch category detail:', error);
      throw error;
    }
  }

  /**
   * Tạo danh mục mới
   */
  async createCategory(data: Omit<Category, 'id' | 'productCount'>): Promise<Category | null> {
    try {
      const response = await apiService.post<Category>('/categories', data);
      
      if (response.status === 201 && response.data) {
        return response.data;
      } else {
        console.error('Error creating category:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  }

  /**
   * Cập nhật danh mục
   */
  async updateCategory(categoryId: string, data: Partial<Category>): Promise<Category | null> {
    try {
      const response = await apiService.put<Category>(`/categories/${categoryId}`, data);
      
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        console.error('Error updating category:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  }

  /**
   * Xóa danh mục
   */
  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/categories/${categoryId}`);
      
      if (response.status === 200) {
        return true;
      } else {
        console.error('Error deleting category:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  }
}

export default new CategoryService();
