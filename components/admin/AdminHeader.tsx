import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
  currentPage: string;
}

export default function AdminHeader({
  onMenuClick,
  onLogout,
  currentPage,
}: AdminHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      products: 'Quản lý sản phẩm',
      orders: 'Quản lý đơn hàng',
      customers: 'Quản lý khách hàng',
      analytics: 'Phân tích',
    };
    return titles[currentPage] || 'Admin Panel';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left: Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuClick}>
          <Ionicons name="menu" size={24} color="#1f2937" />
        </TouchableOpacity>

        {/* Center: Title */}
        <Text style={styles.title}>{getPageTitle()}</Text>

        {/* Right: Actions */}
        <View style={styles.actions}>
          {/* Notifications */}
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications" size={20} color="#1f2937" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Profile Menu */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="person-circle" size={28} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        {showMenu && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuOption}>
              <Ionicons name="person" size={18} color="#1f2937" />
              <Text style={styles.optionText}>Hồ sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption}>
              <Ionicons name="settings" size={18} color="#1f2937" />
              <Text style={styles.optionText}>Cài đặt</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[styles.menuOption, styles.logoutOption]}
              onPress={onLogout}
            >
              <Ionicons name="log-out" size={18} color="#dc2626" />
              <Text style={[styles.optionText, styles.logoutText]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'relative',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuOption: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  logoutOption: {
    paddingVertical: 12,
  },
  logoutText: {
    color: '#dc2626',
  },
});
