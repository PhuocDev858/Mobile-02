import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Order, useAdmin } from '../../context/admin/AdminContext';

export default function OrderManagement() {
  const { orders, updateOrderStatus, deleteOrder, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#b45309' },
      processing: { bg: '#dbeafe', text: '#1e40af' },
      shipped: { bg: '#e9d5ff', text: '#6b21a8' },
      delivered: { bg: '#dcfce7', text: '#166534' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return statusColors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return statusTexts[status] || status;
  };

  // Tính các trang cần hiển thị
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxVisible - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const statusOptions: Order['status'][] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa đơn hàng', 'Bạn có chắc muốn xóa đơn hàng này?', [
      { text: 'Hủy', onPress: () => {} },
      { text: 'Xóa', onPress: () => deleteOrder(id) },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quản lý đơn hàng</Text>
            <Text style={styles.subtitle}>{orders.length} đơn hàng</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn hàng, khách hàng..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === 'all' && styles.filterTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
            (status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filterStatus === status && styles.filterTextActive,
                  ]}
                >
                  {getStatusText(status)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bag" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Không tìm thấy đơn hàng nào</Text>
          </View>
        ) : (
          <>
            {paginatedOrders.map((order, index) => {
              const statusColor = getStatusColor(order.status);
              const isSelected = selectedOrder?.id === order.id;
              return (
                <View
                  key={order.id}
                  style={[
                    styles.orderCard,
                    index === paginatedOrders.length - 1 && styles.lastCard,
                    isSelected && styles.selectedCard,
                  ]}
                >
                  {/* Order Header */}
                  <TouchableOpacity
                    style={styles.orderHeader}
                    onPress={() =>
                      setSelectedOrder(isSelected ? null : order)
                    }
                  >
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <Text style={styles.orderCustomer}>{order.customer}</Text>
                      <Text style={styles.orderDate}>{order.date}</Text>
                    </View>
                    <View style={styles.orderMeta}>
                      <Text style={styles.orderTotal}>{order.total}</Text>
                      <View
                        style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
                      >
                        <Text
                          style={[styles.statusText, { color: statusColor.text }]}
                        >
                          {getStatusText(order.status)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Order Details */}
                  {isSelected && (
                    <View style={styles.orderDetails}>
                      {/* Order Summary */}
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{order.email}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Số sản phẩm:</Text>
                        <Text style={styles.detailValue}>{order.items}</Text>
                      </View>
                    </View>

                    {/* Status Management */}
                    <View style={styles.statusSection}>
                      <Text style={styles.sectionTitle}>Cập nhật trạng thái</Text>
                      <View style={styles.statusOptions}>
                        {statusOptions.map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              styles.statusOption,
                              order.status === status && styles.statusOptionActive,
                            ]}
                            onPress={() =>
                              handleStatusChange(order.id, status)
                            }
                          >
                            <Text
                              style={[
                                styles.statusOptionText,
                                order.status === status && styles.statusOptionTextActive,
                              ]}
                            >
                              {getStatusText(status)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionSection}>
                      <TouchableOpacity style={styles.actionButtonSecondary}>
                        <Ionicons name="document-text" size={18} color="#7c3aed" />
                        <Text style={styles.actionButtonText}>Chi tiết</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonSecondary, styles.deleteAction]}
                        onPress={() => handleDelete(order.id)}
                      >
                        <Ionicons name="trash" size={18} color="#dc2626" />
                        <Text style={[styles.actionButtonText, { color: '#dc2626' }]}>
                          Xóa
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#ccc' : '#7c3aed'} />
                </TouchableOpacity>

                <View style={styles.paginationInfo}>
                  {getPaginationPages().map((page, index) => (
                    <View key={index}>
                      {typeof page === 'number' ? (
                        <TouchableOpacity
                          style={[
                            styles.pageButton,
                            currentPage === page && styles.pageButtonActive,
                          ]}
                          onPress={() => setCurrentPage(page)}
                        >
                          <Text
                            style={[
                              styles.pageText,
                              currentPage === page && styles.pageTextActive,
                            ]}
                          >
                            {page}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.ellipsis}>{page}</Text>
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#ccc' : '#7c3aed'} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#fff',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lastCard: {
    marginBottom: 0,
  },
  selectedCard: {
    borderColor: '#7c3aed',
    borderWidth: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  orderMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
  },
  statusSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusOption: {
    flex: 0.48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#7c3aed',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  statusOptionTextActive: {
    color: '#fff',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  deleteAction: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paginationButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationInfo: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  pageButtonActive: {
    backgroundColor: '#7c3aed',
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pageTextActive: {
    color: '#fff',
  },
  ellipsis: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    paddingHorizontal: 4,
  },
  spacer: {
    height: 20,
  },
});
