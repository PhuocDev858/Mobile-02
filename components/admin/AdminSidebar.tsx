import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'categories', label: 'Danh mục', icon: 'folder' },
  { id: 'products', label: 'Sản phẩm', icon: 'cube' },
  { id: 'orders', label: 'Đơn hàng', icon: 'cart' },
  { id: 'customers', label: 'Khách hàng', icon: 'people' },
  { id: 'analytics', label: 'Phân tích', icon: 'bar-chart' },
];

export default function AdminSidebar({
  currentPage,
  onNavigate,
  onClose,
}: AdminSidebarProps) {
  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    onClose?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.appName}>Tech Store</Text>
              <Text style={styles.appSubtitle}>Admin</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() => handleNavigate(item.id)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? '#7c3aed' : '#6b7280'}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  menu: {
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  menuIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
  },
  activeMenuLabel: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: '#7c3aed',
    marginLeft: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
