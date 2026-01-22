import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAdmin } from '../../context/admin/AdminContext';

export default function Analytics() {
  const { products, orders, customers, loading } = useAdmin();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue trend data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 3800 },
    { month: 'Mar', revenue: 5200 },
    { month: 'Apr', revenue: 4800 },
    { month: 'May', revenue: 6100 },
    { month: 'Jun', revenue: 5900 },
  ];

  // Product performance - top products by stock
  const topProducts = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sold: p.stock,
      revenue: p.price * p.stock,
    }));

  // Customer distribution
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const inactiveCustomers = customers.filter((c) => c.status === 'inactive').length;

  // Order status distribution
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const getMaxRevenueBar = () => {
    return Math.max(...monthlyRevenue.map((m) => m.revenue));
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
            <Text style={styles.title}>Phân tích</Text>
            <Text style={styles.subtitle}>Tổng quan hiệu suất kinh doanh</Text>
          </View>
        </View>

        {/* Time Frame Selector */}
        <View style={styles.timeFrameContainer}>
          <TouchableOpacity
            style={[
              styles.timeFrameBtn,
              timeFrame === 'week' && styles.timeFrameBtnActive,
            ]}
            onPress={() => setTimeFrame('week')}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === 'week' && styles.timeFrameTextActive,
              ]}
            >
              Tuần
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeFrameBtn,
              timeFrame === 'month' && styles.timeFrameBtnActive,
            ]}
            onPress={() => setTimeFrame('month')}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === 'month' && styles.timeFrameTextActive,
              ]}
            >
              Tháng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeFrameBtn,
              timeFrame === 'year' && styles.timeFrameBtnActive,
            ]}
            onPress={() => setTimeFrame('year')}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === 'year' && styles.timeFrameTextActive,
              ]}
            >
              Năm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="cash" size={24} color="#7c3aed" />
            </View>
            <Text style={styles.metricLabel}>Doanh thu</Text>
            <Text style={styles.metricValue}>${(totalRevenue / 1000).toFixed(1)}K</Text>
            <Text style={styles.metricTrend}>+12.5% từ tháng trước</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="bag" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.metricLabel}>Đơn hàng</Text>
            <Text style={styles.metricValue}>{totalOrders}</Text>
            <Text style={styles.metricTrend}>+8.2% từ tháng trước</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="person" size={24} color="#10b981" />
            </View>
            <Text style={styles.metricLabel}>Khách hàng</Text>
            <Text style={styles.metricValue}>{totalCustomers}</Text>
            <Text style={styles.metricTrend}>+5.1% từ tháng trước</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="trending-up" size={24} color="#06b6d4" />
            </View>
            <Text style={styles.metricLabel}>Trung bình đơn hàng</Text>
            <Text style={styles.metricValue}>${avgOrderValue.toFixed(0)}</Text>
            <Text style={styles.metricTrend}>+3.2% từ tháng trước</Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Doanh thu theo tháng</Text>
          <View style={styles.chart}>
            {monthlyRevenue.map((item, index) => {
              const barHeight = (item.revenue / getMaxRevenueBar()) * 120;
              return (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor:
                          index % 2 === 0 ? '#7c3aed' : '#a78bfa',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.month}</Text>
                  <Text style={styles.barValue}>${(item.revenue / 1000).toFixed(1)}K</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Order Status Distribution */}
        <View style={styles.distributionCard}>
          <Text style={styles.distributionTitle}>Trạng thái đơn hàng</Text>
          <View style={styles.statusDistribution}>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={[styles.statusText, { color: '#f59e0b' }]}>
                Đang chờ: {pendingOrders}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={[styles.statusText, { color: '#3b82f6' }]}>
                Xử lý: {processingOrders}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={[styles.statusText, { color: '#8b5cf6' }]}>
                Đã gửi: {shippedOrders}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={[styles.statusText, { color: '#10b981' }]}>
                Đã giao: {deliveredOrders}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.topProductsCard}>
          <Text style={styles.topProductsTitle}>Sản phẩm bán chạy nhất</Text>
          {topProducts.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
          ) : (
            topProducts.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productRank}>
                  <Text style={styles.productRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productStats}>
                    {product.sold} bán • ${product.revenue.toFixed(0)}
                  </Text>
                </View>
                <View style={styles.productRevenue}>
                  <Text style={styles.productRevenueText}>
                    ${(product.revenue / 1000).toFixed(1)}K
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Customer Demographics */}
        <View style={styles.demographicsCard}>
          <Text style={styles.demographicsTitle}>Phân bổ khách hàng</Text>
          <View style={styles.demographicItem}>
            <View style={styles.demographicLabel}>
              <Text style={styles.demographicText}>Hoạt động</Text>
            </View>
            <View style={styles.demographicBar}>
              <View
                style={[
                  styles.demographicFill,
                  {
                    width: `${
                      totalCustomers > 0
                        ? (activeCustomers / totalCustomers) * 100
                        : 0
                    }%`,
                    backgroundColor: '#10b981',
                  },
                ]}
              />
            </View>
            <Text style={styles.demographicValue}>
              {activeCustomers} ({totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}%)
            </Text>
          </View>
          <View style={styles.demographicItem}>
            <View style={styles.demographicLabel}>
              <Text style={styles.demographicText}>Ngưng</Text>
            </View>
            <View style={styles.demographicBar}>
              <View
                style={[
                  styles.demographicFill,
                  {
                    width: `${
                      totalCustomers > 0
                        ? (inactiveCustomers / totalCustomers) * 100
                        : 0
                    }%`,
                    backgroundColor: '#ef4444',
                  },
                ]}
              />
            </View>
            <Text style={styles.demographicValue}>
              {inactiveCustomers} ({totalCustomers > 0 ? ((inactiveCustomers / totalCustomers) * 100).toFixed(1) : 0}%)
            </Text>
          </View>
        </View>

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
  timeFrameContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timeFrameBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  timeFrameBtnActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  timeFrameText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  timeFrameTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 10,
    color: '#10b981',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginTop: 12,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1f2937',
  },
  distributionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusDistribution: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusDot: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  topProductsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topProductsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productRank: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  productRankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  productStats: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  productRevenueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 16,
  },
  demographicsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  demographicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  demographicItem: {
    marginBottom: 16,
  },
  demographicLabel: {
    marginBottom: 4,
  },
  demographicText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  demographicBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  demographicFill: {
    height: '100%',
    borderRadius: 4,
  },
  demographicValue: {
    fontSize: 11,
    color: '#6b7280',
  },
  spacer: {
    height: 20,
  },
});
