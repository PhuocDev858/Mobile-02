import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import categoryService from '../../services/category.service';
import customerService from '../../services/customer.service';
import orderService from '../../services/order.service';
import productService from '../../services/product.service';

// Types
export interface Product {
  id: string;
  name: string;
  category: string | Category;
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

// Helper function để map stock từ backend
const mapProductFromBackend = (p: any) => {
  // Log raw data để debug
  console.log(`📝 Raw product data for "${p.name}":`, {
    category: p.category,
    categoryId: p.categoryId,
    category_id: p.category_id,
    stockQuantity: p.stockQuantity,
    stock_quantity: p.stock_quantity,
    quantity: p.quantity,
    stock: p.stock,
  });

  // Try to get stock từ nhiều field khác nhau (priority order)
  const stockValue = 
    p.stockQuantity !== undefined ? p.stockQuantity :      // Backend gửi stockQuantity (camelCase)
    p.stock_quantity !== undefined ? p.stock_quantity :    // Hoặc stock_quantity (snake_case)
    p.quantity !== undefined ? p.quantity :                 // Hoặc quantity
    p.stock !== undefined ? p.stock :                       // Hoặc stock
    100;                                                    // Fallback

  // Handle category - có thể là object, string, hoặc ID
  let categoryValue: string | Category = 'Unknown';
  
  if (p.category) {
    // Nếu category đã là object (có id, name)
    if (typeof p.category === 'object' && p.category.id) {
      categoryValue = p.category as Category;
    } else if (typeof p.category === 'string') {
      categoryValue = p.category;
    }
  } else if (p.categoryId || p.category_id) {
    // Nếu chỉ có categoryId (số hoặc string)
    const catId = p.categoryId || p.category_id;
    categoryValue = {
      id: String(catId),
      name: `Category ${catId}`,
    } as Category;
  }

  console.log(`✅ Mapped stock for "${p.name}": ${stockValue}, category:`, categoryValue);

  return {
    id: p.id || p._id,
    name: p.name || 'Unknown',
    category: categoryValue,
    price: p.price || 0,
    stock: stockValue,
    image: p.image || '',
    description: p.description || '',
  };
};

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
      console.log('📦 Raw dữ liệu sản phẩm từ backend:', productsData);
      
      let formattedProducts: Product[] = [];
      if (productsData?.products && Array.isArray(productsData.products)) {
        console.log('📦 Parsing products array từ productsData.products');
        formattedProducts = productsData.products.map(mapProductFromBackend);
      } else if (Array.isArray(productsData)) {
        console.log('📦 Parsing products array trực tiếp');
        formattedProducts = productsData.map(mapProductFromBackend);
      } else {
        console.warn('⚠️ Unexpected products data format:', productsData);
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
      const formattedCategories: Category[] = (categoriesData || []).map((cat: any) => {
        // Tính productCount dựa trên products trong danh mục
        const productCountInCategory = formattedProducts.filter(p => {
          const prodCategoryName = typeof p.category === 'string' ? p.category : p.category?.name;
          return prodCategoryName === cat.name || prodCategoryName === cat.slug;
        }).length;
        
        return {
          id: cat._id || cat.id || Math.random().toString(),
          name: cat.name || 'N/A',
          slug: cat.slug || '',
          icon: cat.icon || '📁',
          image: cat.image || '',
          productCount: productCountInCategory > 0 ? productCountInCategory : (cat.productCount || 0),
          description: cat.description || '',
        };
      });
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
      console.log('📦 Adding product:', product);
      const newProduct = await productService.createProduct(product as any);
      if (newProduct) {
        // Map response để chắc chắn stock được set đúng
        const mappedProduct: Product = {
          ...newProduct,
          stock: (newProduct as any).stock_quantity !== undefined ? (newProduct as any).stock_quantity : newProduct.stock,
        };
        console.log('✅ Mapped new product:', mappedProduct);
        setProducts(prevProducts => [...prevProducts, mappedProduct]);
        
        // Update productCount của category
        const categoryId = (product.category as any)?.id || (typeof product.category === 'string' ? product.category : '');
        const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
        console.log('🔍 Looking for category ID:', categoryId, 'or name:', categoryName, 'in categories:', categories.map(c => ({ id: c.id, name: c.name })));
        
        setCategories(prevCategories =>
          prevCategories.map(cat => {
            const isMatch = cat.id === categoryId || cat.name === categoryName;
            console.log(`🔍 Checking category "${cat.name}" (${cat.id}) - Match: ${isMatch}`);
            if (isMatch) {
              const updated = { ...cat, productCount: (cat.productCount || 0) + 1 };
              console.log(`✅ Updated category "${cat.name}" productCount to`, updated.productCount);
              return updated;
            }
            return cat;
          })
        );
        
        Alert.alert('Thành công', 'Thêm sản phẩm thành công');
      }
    } catch (error: any) {
      console.error('❌ Error adding product:', error);
      const errorMessage = error.message || 'Không thể thêm sản phẩm';
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      console.log('📦 Updating product:', id, updates);
      
      // Get old product to check if category changed
      const oldProduct = products.find(p => p.id === id);
      const oldCategoryId = (oldProduct && typeof oldProduct.category !== 'string') ? (oldProduct.category as any).id : '';
      const oldCategoryName = (oldProduct && typeof oldProduct.category === 'string') ? oldProduct.category : ((oldProduct && typeof oldProduct.category !== 'string') ? (oldProduct.category as any).name : '');
      
      const updated = await productService.updateProduct(id, updates as any);
      if (updated) {
        console.log('📦 Updated response:', updated);
        
        // Xử lý category từ updates - có thể là ID hoặc object
        let categoryToStore = updates.category;
        let newCategoryId = '';
        let newCategoryName = '';
        
        if (updates.category) {
          if (typeof updates.category === 'string') {
            newCategoryName = updates.category;
          } else if (typeof updates.category === 'number') {
            // Category là ID (số)
            newCategoryId = String(updates.category);
            // Tìm category name từ categories array
            const foundCategory = categories.find(c => c.id === newCategoryId);
            if (foundCategory) {
              newCategoryName = foundCategory.name;
              categoryToStore = foundCategory;
            } else {
              // Nếu không tìm được, vẫn set categoryToStore (có thể là ID)
              console.warn('⚠️ Category ID not found:', newCategoryId);
              categoryToStore = updates.category;
            }
          } else {
            // Category là object
            newCategoryId = (updates.category as any).id;
            newCategoryName = (updates.category as any).name;
          }
        }
        
        // Map response để chắc chắn stock được set đúng
        // Backend có thể return stockQuantity hoặc trong data.stockQuantity
        let stockValue = updates.stock;
        if ((updated as any).stockQuantity !== undefined) {
          stockValue = (updated as any).stockQuantity;
        } else if ((updated as any).data?.stockQuantity !== undefined) {
          stockValue = (updated as any).data.stockQuantity;
        } else if ((updated as any).stock_quantity !== undefined) {
          stockValue = (updated as any).stock_quantity;
        } else if (updated.stock !== undefined) {
          stockValue = updated.stock;
        }
        console.log('📊 Stock value extracted:', stockValue);
        
        const mappedUpdates: Partial<Product> = {
          stock: stockValue,
        };
        
        if (categoryToStore !== undefined) {
          mappedUpdates.category = categoryToStore;
        }
        
        // Copy other fields from updates
        if (updates.name !== undefined) mappedUpdates.name = updates.name;
        if (updates.price !== undefined) mappedUpdates.price = updates.price;
        if (updates.image !== undefined) mappedUpdates.image = updates.image;
        if (updates.description !== undefined) mappedUpdates.description = updates.description;
        
        console.log('✅ Mapped updates:', mappedUpdates);
        setProducts(prevProducts => prevProducts.map(p => (p.id === id ? { ...p, ...mappedUpdates } : p)));
        
        // Update category counts if category changed
        console.log('🔍 Category change check - Old:', oldCategoryId || oldCategoryName, 'New:', newCategoryId || newCategoryName);
        
        if ((newCategoryId || newCategoryName) && (newCategoryId !== oldCategoryId || newCategoryName !== oldCategoryName)) {
          setCategories(prevCategories =>
            prevCategories.map(cat => {
              let updated = cat;
              // Decrease old category count
              if (cat.id === oldCategoryId || cat.name === oldCategoryName) {
                updated = { ...updated, productCount: Math.max(0, (updated.productCount || 0) - 1) };
                console.log(`📉 Decreased old category "${cat.name}" count to`, updated.productCount);
              }
              // Increase new category count
              if (cat.id === newCategoryId || cat.name === newCategoryName) {
                updated = { ...updated, productCount: (updated.productCount || 0) + 1 };
                console.log(`📈 Increased new category "${cat.name}" count to`, updated.productCount);
              }
              return updated;
            })
          );
        }
        
        Alert.alert('Thành công', 'Cập nhật sản phẩm thành công');
      }
    } catch (error: any) {
      console.error('❌ Error updating product:', error);
      const errorMessage = error.message || 'Không thể cập nhật sản phẩm';
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // Get the product being deleted to know which category to update
      const deletedProduct = products.find(p => p.id === id);
      const success = await productService.deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
        
        // Update productCount của category
        if (deletedProduct) {
          const categoryId = (deletedProduct.category as any)?.id || (typeof deletedProduct.category === 'string' ? deletedProduct.category : '');
          const categoryName = typeof deletedProduct.category === 'string' ? deletedProduct.category : deletedProduct.category?.name;
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.id === categoryId || cat.name === categoryName
                ? { ...cat, productCount: Math.max(0, (cat.productCount || 0) - 1) }
                : cat
            )
          );
        }
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
