import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ResetPasswordScreen() {
  const colorScheme = 'light';
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      // Tạo OTP random để gửi kèm (backend yêu cầu resetToken)
      const resetToken = Math.floor(Math.random() * 900000) + 100000;
      
      const response = await authService.resetPassword({
        resetToken: resetToken.toString(),
        email: email,
        newPassword: password,
        confirmPassword,
      });

      if (response.data?.success) {
        // Sau reset password thành công, tự động login với password mới để có token
        console.log('🔑 Reset password successful, auto-logging in...');
        
        const loginResponse = await authService.login({
          email: email,
          password: password,
        });

        if (loginResponse.data?.token || (loginResponse.data as any)?.data?.token) {
          console.log('✅ Auto login successful after reset');
          Alert.alert('Thành công', 'Mật khẩu đã được đặt lại và bạn đã được tự động đăng nhập.', [
            {
              text: 'Quay về trang chủ',
              onPress: () => {
                router.replace('/');
              },
            },
          ]);
        } else {
          console.log('⚠️ Reset successful but auto-login failed');
          Alert.alert(
            'Thành công',
            'Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.',
            [
              {
                text: 'Quay về đăng nhập',
                onPress: () => {
                  router.replace('/login');
                },
              },
            ]
          );
        }
      } else {
        Alert.alert(
          'Lỗi',
          response.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
        );
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logoImage} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: '#66ccff' }]}>Đặt lại mật khẩu</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].tabIconDefault }]}>
          Nhập mật khẩu mới của bạn{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mật khẩu mới</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    borderColor: errors.password ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                    color: Colors[colorScheme].text,
                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                  },
                ]}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Xác nhận mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    borderColor: errors.confirmPassword
                      ? '#ff4444'
                      : Colors[colorScheme].tabIconDefault,
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
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleResetPassword}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Đặt lại mật khẩu</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={[styles.backLink, { color: Colors[colorScheme].tint }]}>
                ← Quay lại
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: '600',
    color: '#66ccff',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
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
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  backContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
