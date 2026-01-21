import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UserProfileScreen() {
  const colorScheme = 'light';
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      const userData = response.data?.data || response.data || response;
      if (userData) {
        setUserInfo(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: Colors[colorScheme].tint }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Thông tin người dùng</Text>
        </View>

        {/* User Info Section */}
        {userInfo ? (
          <>
            <View style={[styles.userInfoSection, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint }]}>
                <Text style={styles.avatarText}>
                  {(userInfo.fullName || userInfo.name || userInfo.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              {/* User Details */}
              <View style={styles.userDetailsSection}>
                <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                  Tên
                </Text>
                <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
                  {userInfo.fullName || userInfo.name || 'Người dùng'}
                </Text>

                <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                  Email
                </Text>
                <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
                  {userInfo.email}
                </Text>

                {userInfo.username && (
                  <>
                    <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                      Username
                    </Text>
                    <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
                      @{userInfo.username}
                    </Text>
                  </>
                )}

                {userInfo.id && (
                  <>
                    <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                      ID tài khoản
                    </Text>
                    <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
                      {userInfo.id}
                    </Text>
                  </>
                )}
              </View>
            </View>

            {/* Update Profile Button */}
            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={() => {
                router.push('/edit-profile');
              }}>
              <Text style={styles.updateButtonText}>✏️ Cập nhật hồ sơ</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
              Không thể tải thông tin tài khoản
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={() => fetchUserData()}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
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
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
  userDetailsSection: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    marginTop: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  updateButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
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
