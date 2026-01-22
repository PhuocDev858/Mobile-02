import { useAdmin } from '../../context/AdminContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export default function Analytics() {
  const { products, orders, customers } = useAdmin();

  // Revenue over time (mock data for past 12 months)
  const revenueData = [
    { month: 'T1', revenue: 12400, orders: 45, newCustomers: 12 },
    { month: 'T2', revenue: 15800, orders: 52, newCustomers: 15 },
    { month: 'T3', revenue: 18200, orders: 61, newCustomers: 18 },
    { month: 'T4', revenue: 16500, orders: 55, newCustomers: 14 },
    { month: 'T5', revenue: 21000, orders: 68, newCustomers: 22 },
    { month: 'T6', revenue: 19800, orders: 63, newCustomers: 19 },
    { month: 'T7', revenue: 23500, orders: 75, newCustomers: 25 },
    { month: 'T8', revenue: 25200, orders: 82, newCustomers: 28 },
    { month: 'T9', revenue: 22800, orders: 71, newCustomers: 21 },
    { month: 'T10', revenue: 27400, orders: 88, newCustomers: 31 },
    { month: 'T11', revenue: 29100, orders: 94, newCustomers: 35 },
    { month: 'T12', revenue: 31800, orders: 102, newCustomers: 38 }
  ];

  // Category distribution
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
      existing.revenue += product.price * product.sold;
    } else {
      acc.push({
        name: product.category,
        value: 1,
        revenue: product.price * product.sold
      });
    }
    return acc;
  }, [] as { name: string; value: number; revenue: number }[]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  // Top customers by spending
  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Product performance
  const productPerformance = products.map(p => ({
    name: p.name.slice(0, 15),
    sold: p.sold,
    revenue: p.price * p.sold,
    stock: p.stock
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Calculate growth metrics
  const lastMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const previousMonthRevenue = revenueData[revenueData.length - 2].revenue;
  const revenueGrowth = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

  const lastMonthOrders = revenueData[revenueData.length - 1].orders;
  const previousMonthOrders = revenueData[revenueData.length - 2].orders;
  const ordersGrowth = ((lastMonthOrders - previousMonthOrders) / previousMonthOrders * 100).toFixed(1);

  const metrics = [
    {
      label: 'Tăng trưởng doanh thu',
      value: `${revenueGrowth}%`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
      trend: Number(revenueGrowth) > 0
    },
    {
      label: 'Tăng trưởng đơn hàng',
      value: `${ordersGrowth}%`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      trend: Number(ordersGrowth) > 0
    },
    {
      label: 'Sản phẩm bán chạy',
      value: products.reduce((sum, p) => sum + p.sold, 0),
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      trend: true
    },
    {
      label: 'Tỷ lệ khách quay lại',
      value: '68%',
      icon: Users,
      color: 'text-pink-600',
      bg: 'bg-pink-100',
      trend: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Phân tích & Báo cáo</h1>
        <p className="text-gray-600 mt-1">Thống kê chi tiết về hiệu suất kinh doanh</p>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                {metric.trend ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue & Orders Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Xu hướng doanh thu & đơn hàng (12 tháng)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Doanh thu ($)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorOrders)"
              name="Đơn hàng"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Phân bố theo danh mục</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600">{cat.name}: </span>
                <span className="font-medium text-gray-900">${cat.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products by Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Top 10 sản phẩm theo doanh thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} fontSize={11} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Doanh thu ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Customers & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Customers Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Khách hàng mới (12 tháng)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="newCustomers"
                stroke="#10b981"
                strokeWidth={2}
                name="Khách hàng mới"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Top 5 khách hàng VIP</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.orders} đơn hàng</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">${customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Chi tiêu</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Tổng quan hiệu suất</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-purple-900">
              ${revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-blue-900">
              {revenueData.reduce((sum, d) => sum + d.orders, 0)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Sản phẩm đã bán</p>
            <p className="text-2xl font-bold text-green-900">
              {products.reduce((sum, p) => sum + p.sold, 0)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
            <p className="text-sm text-pink-700 mb-1">Khách hàng mới</p>
            <p className="text-2xl font-bold text-pink-900">
              {revenueData.reduce((sum, d) => sum + d.newCustomers, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
