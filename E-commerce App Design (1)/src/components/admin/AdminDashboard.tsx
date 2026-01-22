import { useAdmin } from '../../context/AdminContext';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { products, orders, customers } = useAdmin();

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  // Revenue by month (mock data)
  const revenueData = [
    { month: 'T1', revenue: 12400 },
    { month: 'T2', revenue: 15800 },
    { month: 'T3', revenue: 18200 },
    { month: 'T4', revenue: 16500 },
    { month: 'T5', revenue: 21000 },
    { month: 'T6', revenue: 19800 },
  ];

  // Top selling products
  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map(p => ({ name: p.name.slice(0, 20), sold: p.sold }));

  // Order status distribution
  const orderStatusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#fbbf24' },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#3b82f6' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#8b5cf6' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
  ];

  const stats = [
    {
      label: 'Tổng doanh thu',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12.5%',
      up: true
    },
    {
      label: 'Đơn hàng',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: `${pendingOrders} chờ xử lý`,
      up: false
    },
    {
      label: 'Sản phẩm',
      value: totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      trend: `${lowStockProducts} sắp hết`,
      up: false
    },
    {
      label: 'Khách hàng',
      value: totalCustomers,
      icon: Users,
      color: 'bg-pink-500',
      trend: '+3 mới',
      up: true
    },
  ];

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.up ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={stat.up ? 'text-green-600' : 'text-gray-600'}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Doanh thu 6 tháng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Top 5 sản phẩm bán chạy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Mã đơn</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Khách hàng</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Tổng tiền</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">${order.total.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
