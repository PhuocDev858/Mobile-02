import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { apiService } from '@/services/api.service';
import { authService } from '@/services/auth.service';

interface UserInfo {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
  username?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function AccountScreen() {
  const colorScheme = 'light';
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // ✅ Kiểm tra token trước khi gọi API
      const token = await apiService.getToken();
      if (!token) {
        console.log('ℹ️ Chưa đăng nhập, skip fetch user data');
        setUserInfo(null);
        setLoading(false);
        return;
      }
      
      const response = await authService.getCurrentUser();
      
      const userData = response.data?.data || response.data || response;
      
      if (userData) {
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Nếu lỗi 401, xóa token và set userInfo = null
      if (error instanceof Error && error.message?.includes('401')) {
        await apiService.removeToken();
        setUserInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              await authService.logout();
              setUserInfo(null);
              setLoading(false);
              Alert.alert('Thành công', 'Bạn đã đăng xuất thành công');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'orders',
      title: 'Đơn hàng của tôi',
      icon: '📦',
      onPress: () => {
        if (!userInfo) {
          Alert.alert('Thông báo', 'Quý khách vui lòng đăng nhập/đăng ký tài khoản để sử dụng chức năng này');
          return;
        }
        Alert.alert('Thông báo', 'Tính năng đơn hàng sẽ sớm có');
      },
    },
    {
      id: 'address',
      title: 'Địa chỉ giao hàng',
      icon: '📍',
      onPress: () => {
        if (!userInfo) {
          Alert.alert('Thông báo', 'Quý khách vui lòng đăng nhập/đăng ký tài khoản để sử dụng chức năng này');
          return;
        }
        Alert.alert('Thông báo', 'Tính năng quản lý địa chỉ sẽ sớm có');
      },
    },
    {
      id: 'wishlist',
      title: 'Yêu thích',
      icon: '❤️',
      onPress: () => {
        if (!userInfo) {
          Alert.alert('Thông báo', 'Quý khách vui lòng đăng nhập/đăng ký tài khoản để sử dụng chức năng này');
          return;
        }
        Alert.alert('Thông báo', 'Tính năng yêu thích sẽ sớm có');
      },
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: '⚙️',
      onPress: () => {
        if (!userInfo) {
          Alert.alert('Thông báo', 'Quý khách vui lòng đăng nhập/đăng ký tài khoản để sử dụng chức năng này');
          return;
        }
        Alert.alert('Thông báo', 'Tính năng cài đặt sẽ sớm có');
      },
    },
    {
      id: 'help',
      title: 'Trợ giúp & Hỗ trợ',
      icon: '❓',
      onPress: () => {
        if (!userInfo) {
          Alert.alert('Thông báo', 'Quý khách vui lòng đăng nhập/đăng ký tài khoản để sử dụng chức năng này');
          return;
        }
        Alert.alert('Thông báo', 'Tính năng hỗ trợ sẽ sớm có');
      },
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {userInfo ? (
          <>
            {/* User Info Header - Clickable */}
            <TouchableOpacity
              onPress={() => {
                router.push('/user-profile');
              }}
              activeOpacity={0.7}>
              <View style={[styles.userHeader, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint }]}>
                  <ThemedText style={styles.avatarText}>
                    {(userInfo.fullName || userInfo.name || userInfo.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </ThemedText>
                </View>

                {/* User Info */}
                <View style={styles.userDetails}>
                  <ThemedText style={[styles.userName, { color: Colors[colorScheme].text }]}>
                    {userInfo.fullName || userInfo.name || 'Người dùng'}
                  </ThemedText>
                  <ThemedText style={[styles.userEmail, { color: Colors[colorScheme].tabIconDefault }]}>
                    {userInfo.email}
                  </ThemedText>
                  {userInfo.username && (
                    <ThemedText style={[styles.userUsername, { color: Colors[colorScheme].tabIconDefault }]}>
                      @{userInfo.username}
                    </ThemedText>
                  )}
                </View>
                
                {/* Arrow indicator */}
                <ThemedText style={[styles.chevron, { color: Colors[colorScheme].tabIconDefault }]}>
                  ›
                </ThemedText>
              </View>
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <ThemedText style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
                Quản lý
              </ThemedText>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    { borderBottomColor: Colors[colorScheme].tabIconDefault + '20' },
                  ]}
                  onPress={item.onPress}>
                  <View style={styles.menuItemLeft}>
                    <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
                    <ThemedText
                      style={[
                        styles.menuTitle,
                        { color: Colors[colorScheme].text },
                      ]}>
                      {item.title}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.menuArrow, { color: Colors[colorScheme].tabIconDefault }]}>
                    ›
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: '#ff4444' }]}
                onPress={handleLogout}>
                <ThemedText style={styles.logoutText}>🚪 Đăng xuất</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Account Info Footer */}
            <View style={[styles.footerInfo, { backgroundColor: Colors[colorScheme].tabIconDefault + '10' }]}>
              <ThemedText style={[styles.footerLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                ID tài khoản
              </ThemedText>
              <ThemedText style={[styles.footerValue, { color: Colors[colorScheme].text }]}>
                {userInfo.id || 'N/A'}
              </ThemedText>
            </View>
          </>
        ) : (
          <View style={styles.notLoggedInContainer}>
            <ThemedText style={[styles.notLoggedInTitle, { color: Colors[colorScheme].text }]}>
              👤 Tài khoản của tôi
            </ThemedText>
            <ThemedText style={[styles.notLoggedInText, { color: Colors[colorScheme].tabIconDefault }]}>
              Đăng nhập để truy cập tài khoản, theo dõi đơn hàng và lưu sản phẩm yêu thích
            </ThemedText>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={() => router.push('/login')}>
              <ThemedText style={styles.loginButtonText}>🔑 Đăng nhập</ThemedText>
            </TouchableOpacity>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, { borderColor: Colors[colorScheme].tint, borderWidth: 1.5 }]}
              onPress={() => router.push('/signup')}>
              <ThemedText style={[styles.signupButtonText, { color: Colors[colorScheme].tint }]}>
                ✏️ Đăng ký
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 12,
  },
  chevron: {
    fontSize: 24,
    marginLeft: 8,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  logoutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footerInfo: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  notLoggedInContainer: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  notLoggedInTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  notLoggedInText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    maxWidth: 280,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    maxWidth: 320,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  signupButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
