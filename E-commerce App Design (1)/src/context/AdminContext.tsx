import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  status: 'active' | 'inactive';
  sold: number;
}

export interface Order {
  id: string;
  customer: string;
  customerId: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { productId: string; productName: string; quantity: number; price: number }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    category: 'Laptop',
    price: 2499,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    description: 'Apple MacBook Pro 16-inch M3 Max chip',
    status: 'active',
    sold: 45
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    category: 'Điện thoại',
    price: 1199,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400',
    description: 'iPhone 15 Pro Max 256GB Titanium',
    status: 'active',
    sold: 120
  },
  {
    id: '3',
    name: 'iPad Pro 12.9"',
    category: 'Tablet',
    price: 1099,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    description: 'iPad Pro 12.9-inch M2 chip',
    status: 'active',
    sold: 67
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    category: 'Tai nghe',
    price: 249,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    description: 'AirPods Pro 2nd generation with MagSafe',
    status: 'active',
    sold: 234
  },
  {
    id: '5',
    name: 'Apple Watch Ultra 2',
    category: 'Đồng hồ',
    price: 799,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    description: 'Apple Watch Ultra 2 GPS + Cellular',
    status: 'active',
    sold: 89
  },
  {
    id: '6',
    name: 'Sony A7 IV',
    category: 'Camera',
    price: 2498,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    description: 'Sony Alpha A7 IV Mirrorless Camera',
    status: 'active',
    sold: 23
  },
  {
    id: '7',
    name: 'Dell XPS 15',
    category: 'Laptop',
    price: 1799,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    description: 'Dell XPS 15 Intel i9 RTX 4060',
    status: 'active',
    sold: 34
  },
  {
    id: '8',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Điện thoại',
    price: 1299,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    description: 'Samsung Galaxy S24 Ultra 512GB',
    status: 'inactive',
    sold: 156
  }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Nguyễn Văn An',
    customerId: 'CUST-001',
    date: '2024-01-20',
    total: 2748,
    status: 'delivered',
    items: [
      { productId: '1', productName: 'MacBook Pro 16"', quantity: 1, price: 2499 },
      { productId: '4', productName: 'AirPods Pro 2', quantity: 1, price: 249 }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Trần Thị Bình',
    customerId: 'CUST-002',
    date: '2024-01-21',
    total: 1199,
    status: 'shipped',
    items: [
      { productId: '2', productName: 'iPhone 15 Pro Max', quantity: 1, price: 1199 }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Lê Minh Cường',
    customerId: 'CUST-003',
    date: '2024-01-21',
    total: 1898,
    status: 'processing',
    items: [
      { productId: '5', productName: 'Apple Watch Ultra 2', quantity: 2, price: 799 },
      { productId: '4', productName: 'AirPods Pro 2', quantity: 1, price: 249 }
    ]
  },
  {
    id: 'ORD-004',
    customer: 'Phạm Thu Hà',
    customerId: 'CUST-004',
    date: '2024-01-22',
    total: 3597,
    status: 'pending',
    items: [
      { productId: '3', productName: 'iPad Pro 12.9"', quantity: 1, price: 1099 },
      { productId: '6', productName: 'Sony A7 IV', quantity: 1, price: 2498 }
    ]
  },
  {
    id: 'ORD-005',
    customer: 'Hoàng Văn Đức',
    customerId: 'CUST-005',
    date: '2024-01-22',
    total: 1799,
    status: 'pending',
    items: [
      { productId: '7', productName: 'Dell XPS 15', quantity: 1, price: 1799 }
    ]
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0901234567',
    address: '123 Lê Lợi, Q.1, TP.HCM',
    orders: 3,
    totalSpent: 5240,
    joinDate: '2023-11-15',
    status: 'active'
  },
  {
    id: 'CUST-002',
    name: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0912345678',
    address: '456 Nguyễn Huệ, Q.1, TP.HCM',
    orders: 2,
    totalSpent: 2398,
    joinDate: '2023-12-01',
    status: 'active'
  },
  {
    id: 'CUST-003',
    name: 'Lê Minh Cường',
    email: 'leminhcuong@email.com',
    phone: '0923456789',
    address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
    orders: 5,
    totalSpent: 8750,
    joinDate: '2023-10-20',
    status: 'active'
  },
  {
    id: 'CUST-004',
    name: 'Phạm Thu Hà',
    email: 'phamthuha@email.com',
    phone: '0934567890',
    address: '321 Võ Văn Tần, Q.3, TP.HCM',
    orders: 1,
    totalSpent: 3597,
    joinDate: '2024-01-10',
    status: 'active'
  },
  {
    id: 'CUST-005',
    name: 'Hoàng Văn Đức',
    email: 'hoangvanduc@email.com',
    phone: '0945678901',
    address: '654 Lý Thường Kiệt, Q.10, TP.HCM',
    orders: 1,
    totalSpent: 1799,
    joinDate: '2024-01-18',
    status: 'active'
  }
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `${Date.now()}`
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        updateCustomer,
        deleteCustomer
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
