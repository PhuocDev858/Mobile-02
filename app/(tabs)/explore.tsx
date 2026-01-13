import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';

interface UserInfo {
  id?: string;
  email?: string;
  fullName?: string;
  username?: string;
}

export default function AccountScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      console.log('User data response:', response);
      console.log('User data:', response.data);
      if (response.data) {
        setUserInfo(response.data);
      } else {
        console.warn('No user data in response');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin tài khoản');
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
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerSection}>
        <ThemedText type="title" style={styles.title}>
          Tài khoản của tôi
        </ThemedText>
      </ThemedView>

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </ThemedView>
      ) : userInfo ? (
        <ThemedView style={styles.userInfoContainer}>
          <ThemedView style={styles.infoSection}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Họ tên
            </ThemedText>
            <ThemedText style={styles.value}>
              {userInfo.fullName || userInfo.name || 'N/A'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoSection}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Username
            </ThemedText>
            <ThemedText style={styles.value}>{userInfo.username || 'N/A'}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoSection}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Email
            </ThemedText>
            <ThemedText style={styles.value}>{userInfo.email || 'N/A'}</ThemedText>
          </ThemedView>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <ThemedText style={styles.logoutText}>
              Đăng xuất
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchUserData()}
          >
            <ThemedText style={styles.retryButtonText}>Thử lại</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    paddingHorizontal: 12,
  },
  infoSection: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
  },
  label: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
