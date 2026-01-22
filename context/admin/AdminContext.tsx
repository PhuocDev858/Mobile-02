import React, { createContext, useContext, useEffect, useState } from 'react';
import categoryService from '../../services/category.service';
import customerService from '../../services/customer.service';
import orderService from '../../services/order.service';
import productService from '../../services/product.service';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  productCount?: number;
  description?: string;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  categories: Category[];
  loading: boolean;
  
  // Product methods
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order methods
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  
  // Customer methods
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Category methods
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

// Mock data functions
function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      category: 'smartphone',
      price: 999,
      stock: 45,
      image: 'https://via.placeholder.com/300x300?text=iPhone+15',
      description: 'Latest iPhone with advanced features',
    },
    {
      id: '2',
      name: 'MacBook Pro 16"',
      category: 'laptop',
      price: 2499,
      stock: 12,
      image: 'https://via.placeholder.com/300x300?text=MacBook',
      description: 'Professional laptop for creators',
    },
    {
      id: '3',
      name: 'AirPods Pro',
      category: 'headphone',
      price: 249,
      stock: 200,
      image: 'https://via.placeholder.com/300x300?text=AirPods',
      description: 'Premium wireless earbuds',
    },
  ];
}

function getMockOrders(): Order[] {
  return [
    {
      id: '1',
      customer: 'Nguyễn Văn A',
      email: 'a@example.com',
      total: 1500,
      items: 2,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: '2',
      customer: 'Trần Thị B',
      email: 'b@example.com',
      total: 2500,
      items: 1,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'processing',
    },
    {
      id: '3',
      customer: 'Phạm Văn C',
      email: 'c@example.com',
      total: 800,
      items: 3,
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      status: 'shipped',
    },
  ];
}

function getMockCustomers(): Customer[] {
  return [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'a@example.com',
      phone: '0123456789',
      address: 'Hà Nội',
      totalSpent: 5000,
      orders: 5,
      status: 'active',
      joinDate: new Date(Date.now() - 31536000000).toLocaleDateString('vi-VN'),
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'b@example.com',
      phone: '0987654321',
      address: 'TP.HCM',
      totalSpent: 8000,
      orders: 8,
      status: 'active',
      joinDate: new Date(Date.now() - 15768000000).toLocaleDateString('vi-VN'),
    },
    {
      id: '3',
      name: 'Phạm Văn C',
      email: 'c@example.com',
      phone: '0912345678',
      address: 'Đà Nẵng',
      totalSpent: 3000,
      orders: 3,
      status: 'inactive',
      joinDate: new Date(Date.now() - 7884000000).toLocaleDateString('vi-VN'),
    },
  ];
}

function getMockCategories(): Category[] {
  return [
    {
      id: '1',
      name: 'Điện thoại',
      slug: 'dien-thoai',
      icon: '📱',
      productCount: 45,
      description: 'Điện thoại thông minh',
    },
    {
      id: '2',
      name: 'Laptop',
      slug: 'laptop',
      icon: '💻',
      productCount: 12,
      description: 'Máy tính xách tay',
    },
    {
      id: '3',
      name: 'Tai nghe',
      slug: 'tai-nghe',
      icon: '🎧',
      productCount: 28,
      description: 'Tai nghe và loa',
    },
    {
      id: '4',
      name: 'Phụ kiện',
      slug: 'phu-kien',
      icon: '🔌',
      productCount: 156,
      description: 'Phụ kiện công nghệ',
    },
    {
      id: '5',
      name: 'Máy tính bảng',
      slug: 'may-tinh-bang',
      icon: '📊',
      productCount: 18,
      description: 'Tablet và iPad',
    },
  ];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Đang tải dữ liệu admin...');
      
      // Load products từ backend
      console.log('📦 Tải sản phẩm...');
      const productsData = await productService.getAllProducts();
      console.log('📦 Dữ liệu sản phẩm:', productsData);
      
      let formattedProducts: Product[] = [];
      if (productsData?.products && Array.isArray(productsData.products)) {
        formattedProducts = productsData.products.map((p: any) => ({
          id: p.id || p._id,
          name: p.name || 'Unknown',
          category: p.category || 'Unknown',
          price: p.price || 0,
          stock: p.stock || 100,
          image: p.image || '',
          description: p.description || '',
        }));
      } else if (Array.isArray(productsData)) {
        formattedProducts = productsData.map((p: any) => ({
          id: p.id || p._id,
          name: p.name || 'Unknown',
          category: p.category || 'Unknown',
          price: p.price || 0,
          stock: p.stock || 100,
          image: p.image || '',
          description: p.description || '',
        }));
      }
      console.log('✅ Sản phẩm đã format:', formattedProducts);
      setProducts(formattedProducts);

      // Load orders từ backend
      console.log('📋 Tải đơn hàng...');
      const ordersData = await orderService.getOrders();
      console.log('📋 Dữ liệu đơn hàng:', ordersData);
      const formattedOrders: Order[] = (ordersData || []).map((o: any) => ({
        id: o._id || o.id || Math.random().toString(),
        customer: o.customerName || o.customer || 'Unknown',
        email: o.customerEmail || o.email || 'N/A',
        total: o.totalAmount || o.total || 0,
        items: o.items?.length || 0,
        date: o.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: o.status || 'pending',
      }));
      console.log('✅ Đơn hàng đã format:', formattedOrders);
      setOrders(formattedOrders);

      // Load customers từ backend
      console.log('👥 Tải khách hàng...');
      const customersData = await customerService.getCustomers();
      console.log('👥 Dữ liệu khách hàng:', customersData);
      const formattedCustomers: Customer[] = (customersData || []).map((c: any) => ({
        id: c._id || c.id || Math.random().toString(),
        name: c.name || 'N/A',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        address: c.address || 'N/A',
        totalSpent: c.totalSpent || 0,
        orders: c.orders || 0,
        status: c.status || 'active',
        joinDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
      }));
      console.log('✅ Khách hàng đã format:', formattedCustomers);
      setCustomers(formattedCustomers);

      // Load categories từ backend
      console.log('📂 Tải danh mục...');
      const categoriesData = await categoryService.getCategories();
      console.log('📂 Dữ liệu danh mục:', categoriesData);
      const formattedCategories: Category[] = (categoriesData || []).map((cat: any) => ({
        id: cat._id || cat.id || Math.random().toString(),
        name: cat.name || 'N/A',
        slug: cat.slug || '',
        icon: cat.icon || '📁',
        image: cat.image || '',
        productCount: cat.productCount || 0,
        description: cat.description || '',
      }));
      console.log('✅ Danh mục đã format:', formattedCategories);
      setCategories(formattedCategories);

      console.log('✅ Tải dữ liệu thành công!');
    } catch (error) {
      console.error('❌ Lỗi tải dữ liệu admin:', error);
      // Nếu backend lỗi, dùng dữ liệu mock
      console.log('⚠️ Sử dụng dữ liệu mock do backend lỗi');
      setProducts(getMockProducts());
      setOrders(getMockOrders());
      setCustomers(getMockCustomers());
      setCategories(getMockCategories());
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await productService.createProduct(product as any);
      if (newProduct) {
        setProducts([...products, newProduct]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await productService.updateProduct(id, updates as any);
      if (updated) {
        setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const success = await productService.deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updated = await orderService.updateOrderStatus(id, status);
      if (updated) {
        setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const success = await orderService.deleteOrder(id);
      if (success) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updated = await customerService.updateCustomer(id, updates);
      if (updated) {
        setCustomers(customers.map(c => (c.id === id ? { ...c, ...updates } : c)));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      // Gọi API backend để xóa khách hàng
      const success = await customerService.deleteCustomer(id);
      if (success) {
        setCustomers(customers.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'productCount'>) => {
    try {
      const newCategory = await categoryService.createCategory(category);
      if (newCategory) {
        setCategories([...categories, newCategory]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await categoryService.updateCategory(id, updates);
      if (updated) {
        setCategories(categories.map(c => (c.id === id ? { ...c, ...updates } : c)));
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const success = await categoryService.deleteCategory(id);
      if (success) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        updateCustomer,
        deleteCustomer,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
