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
import { useAdmin } from '../../context/admin/AdminContext';

export default function CustomerManagement() {
  const { customers, deleteCustomer, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCount = customers.filter((c) => c.status === 'active').length;

  const handleDelete = (id: string) => {
    Alert.alert('Xóa khách hàng', 'Bạn có chắc muốn xóa khách hàng này?', [
      { text: 'Hủy', onPress: () => {} },
      { text: 'Xóa', onPress: () => deleteCustomer(id) },
    ]);
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
            <Text style={styles.title}>Quản lý khách hàng</Text>
            <Text style={styles.subtitle}>{customers.length} khách hàng</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tổng khách hàng</Text>
            <Text style={styles.statValue}>{customers.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{activeCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tổng doanh thu</Text>
            <Text style={[styles.statValue, { color: '#7c3aed' }]}>
              ${(totalRevenue / 1000).toFixed(1)}K
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filters */}
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
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'active' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus('active')}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === 'active' && styles.filterTextActive,
              ]}
            >
              Hoạt động
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'inactive' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus('inactive')}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === 'inactive' && styles.filterTextActive,
              ]}
            >
              Ngưng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Không tìm thấy khách hàng nào</Text>
          </View>
        ) : (
          <>
            {paginatedCustomers.map((customer, index) => (
              <View
                key={customer.id}
                style={[
                  styles.customerCard,
                  index === paginatedCustomers.length - 1 && styles.lastCard,
                ]}
              >
                <View style={styles.customerHeader}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <Text style={styles.customerEmail}>{customer.email}</Text>
                    <Text style={styles.customerPhone}>{customer.phone}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          customer.status === 'active' ? '#dcfce7' : '#fee2e2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: customer.status === 'active' ? '#166534' : '#991b1b',
                        },
                      ]}
                    >
                      {customer.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Đơn hàng</Text>
                    <Text style={styles.statItemValue}>{customer.orders}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Tổng chi tiêu</Text>
                    <Text style={styles.statItemValue}>
                      ${customer.totalSpent.toFixed(0)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemLabel}>Tham gia</Text>
                    <Text style={styles.statItemValue}>{customer.joinDate}</Text>
                  </View>
                </View>

                <View style={styles.customerActions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="pencil" size={16} color="#7c3aed" />
                    <Text style={styles.actionBtnText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtnStyle]}
                    onPress={() => handleDelete(customer.id)}
                  >
                    <Ionicons name="trash" size={16} color="#dc2626" />
                    <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
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
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
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
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lastCard: {
    marginBottom: 0,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  customerEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  customerPhone: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 1,
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
  customerStats: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  deleteBtnStyle: {
    backgroundColor: '#fee2e2',
  },
  actionBtnText: {
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
