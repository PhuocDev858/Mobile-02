import { useState } from 'react';
import { useAdmin, Order } from '../../context/AdminContext';
import { Search, Eye, Trash2, X, Grid3x3, List } from 'lucide-react';

export default function OrderManagement() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      deleteOrder(id);
      setSelectedOrder(null);
    }
  };

  const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">{orders.length} đơn hàng</p>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Dạng lưới"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Dạng danh sách"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm đơn hàng, khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getStatusText(status)} ({orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(order.status)} border-0 cursor-pointer`}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Khách hàng</p>
                <p className="font-medium text-gray-900">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.customerId}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{order.items.length} sản phẩm</p>
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex justify-between">
                      <span className="line-clamp-1">{item.productName}</span>
                      <span className="ml-2">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-purple-600">+{order.items.length - 2} sản phẩm khác</p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Tổng tiền</p>
                <p className="text-2xl font-bold text-purple-600">${order.total.toLocaleString()}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Chi tiết</span>
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Table */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Mã đơn</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Khách hàng</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Ngày đặt</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Tổng tiền</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.customerId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{order.date}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">${order.total.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(order.status)} border-0 cursor-pointer`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {getStatusText(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã KH:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.customerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sản phẩm</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">SL</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Giá</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{item.productName}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-600">${item.price}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-purple-600">${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Xóa đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}