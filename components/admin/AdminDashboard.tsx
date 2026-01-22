import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAdmin } from '../../context/admin/AdminContext';

export default function AdminDashboard() {
  const { products, orders, customers, categories, loading } = useAdmin();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => {
    const total = parseInt(order.total.toString().replace(/[^\d]/g, '')) || 0;
    return sum + total;
  }, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const stats = [
    {
      label: 'Tổng doanh thu',
      value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
      icon: 'cash',
      color: '#10b981',
      trend: '+12.5%',
      up: true,
    },
    {
      label: 'Đơn hàng',
      value: totalOrders,
      icon: 'cart',
      color: '#3b82f6',
      trend: `${pendingOrders} chờ xử lý`,
      up: false,
    },
    {
      label: 'Sản phẩm',
      value: totalProducts,
      icon: 'cube',
      color: '#8b5cf6',
      trend: `${lowStockProducts} sắp hết`,
      up: false,
    },
    {
      label: 'Danh mục',
      value: categories.length,
      icon: 'folder',
      color: '#f59e0b',
      trend: `${totalProducts} sản phẩm`,
      up: true,
    },
    {
      label: 'Khách hàng',
      value: totalCustomers,
      icon: 'people',
      color: '#ec4899',
      trend: '+3 mới',
      up: true,
    },
  ];

  const recentOrders = orders.slice(0, 5);

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

  const StatCard = ({ stat }: { stat: (typeof stats)[0] }) => (
    <View style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{stat.label}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
        <View style={styles.trendContainer}>
          <Ionicons
            name={stat.up ? 'trending-up' : 'trending-down'}
            size={16}
            color={stat.up ? '#10b981' : '#6b7280'}
          />
          <Text style={[styles.trendText, { color: stat.up ? '#10b981' : '#6b7280' }]}>
            {stat.trend}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statIcon,
          { backgroundColor: stat.color + '20' }, // 20% opacity
        ]}
      >
        <Ionicons name={stat.icon as any} size={28} color={stat.color} />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Dashboard</Text>
        <Text style={styles.pageSubtitle}>Tổng quan hệ thống quản lý</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hành động nhanh</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={32} color="#7c3aed" />
            <Text style={styles.actionText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="list" size={32} color="#3b82f6" />
            <Text style={styles.actionText}>Xem đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={32} color="#10b981" />
            <Text style={styles.actionText}>Khách hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bar-chart" size={32} color="#f59e0b" />
            <Text style={styles.actionText}>Phân tích</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {recentOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bag" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
            </View>
          ) : (
            recentOrders.map((order, index) => {
              const statusColor = getStatusColor(order.status);
              return (
                <View
                  key={index}
                  style={[
                    styles.orderRow,
                    index !== recentOrders.length - 1 && styles.orderRowBorder,
                  ]}
                >
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderCustomer}>{order.customer}</Text>
                  </View>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderTotal}>{order.total}</Text>
                    <View
                      style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
                    >
                      <Text style={[styles.statusText, { color: statusColor.text }]}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
        <View style={styles.card}>
          {products.slice(0, 5).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
            </View>
          ) : (
            products.slice(0, 5).map((product, index) => (
              <View
                key={index}
                style={[
                  styles.productRow,
                  index !== 4 && styles.productRowBorder,
                ]}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productMeta}>
                    Kho: {product.stock}
                  </Text>
                </View>
                <View style={styles.productPrice}>
                  <Text style={styles.priceText}>${product.price}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllLink: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  orderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  orderMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
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
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  productMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});
