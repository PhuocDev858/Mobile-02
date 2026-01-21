import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormErrors {
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function EditProfileScreen() {
  const colorScheme = 'light';
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fullName, setFullName] = useState<string>((params.fullName as string) || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response.data?.data || response.data || response;
      if (userData) {
        setUserInfo(userData);
        setFullName(userData.fullName || userData.name || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const validateFullName = () => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Tên không được để trống';
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Tên phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: FormErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateFullName()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile({
        fullName,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Hồ sơ đã được cập nhật', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Lỗi', response.data?.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Mật khẩu đã được đổi', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', response.data?.message || 'Không thể đổi mật khẩu');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: Colors[colorScheme].tint }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Cập nhật hồ sơ</Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: Colors[colorScheme].tabIconDefault + '15' }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === 'profile' ? Colors[colorScheme].tint : 'transparent',
              },
            ]}
            onPress={() => {
              setActiveTab('profile');
              setErrors({});
            }}>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'profile' ? '#fff' : Colors[colorScheme].text,
                  fontWeight: activeTab === 'profile' ? '700' : '500',
                },
              ]}>
              👤 Hồ sơ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === 'password' ? Colors[colorScheme].tint : 'transparent',
              },
            ]}
            onPress={() => {
              setActiveTab('password');
              setErrors({});
            }}>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'password' ? '#fff' : Colors[colorScheme].text,
                  fontWeight: activeTab === 'password' ? '700' : '500',
                },
              ]}>
              🔒 Mật khẩu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View style={styles.tabContent}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Tên đầy đủ</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.fullName ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                    color: Colors[colorScheme].text,
                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                  },
                ]}
                placeholder="Nhập tên của bạn"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleUpdateProfile}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Cập nhật hồ sơ</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <View style={styles.tabContent}>
            {/* Current Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mật khẩu hiện tại</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      borderColor: errors.currentPassword ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                      color: Colors[colorScheme].text,
                      backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                    },
                  ]}
                  placeholder="Nhập mật khẩu hiện tại"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) setErrors({ ...errors, currentPassword: undefined });
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Text style={styles.eyeIcon}>{showCurrentPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
            </View>

            {/* New Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mật khẩu mới</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      borderColor: errors.newPassword ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                      color: Colors[colorScheme].text,
                      backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                    },
                  ]}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Xác nhận mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      borderColor: errors.confirmPassword ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                      color: Colors[colorScheme].text,
                      backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                    },
                  ]}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleChangePassword}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Đổi mật khẩu</Text>
              )}
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
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  tabContent: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
