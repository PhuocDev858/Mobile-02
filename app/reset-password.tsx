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

  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    verificationCode?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: {
      verificationCode?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!verificationCode.trim()) {
      newErrors.verificationCode = 'Mã xác nhận không được để trống';
    } else if (verificationCode.length < 6) {
      newErrors.verificationCode = 'Mã xác nhận phải có ít nhất 6 ký tự';
    }

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
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await authService.resetPassword({
          token: verificationCode,
          password,
          confirmPassword,
        });

        console.log('🔑 Reset Password Response:', response);

        if (response.data || response.status === 200) {
          Alert.alert(
            'Thành công',
            'Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại.',
            [
              {
                text: 'Đăng nhập',
                onPress: () => {
                  router.replace('/login');
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'Lỗi',
            response.error || 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra mã xác nhận.'
          );
        }
      } catch (error: any) {
        console.error('Reset password error:', error);
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin email');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });

      if (response.data || response.status === 200) {
        Alert.alert('Thành công', 'Mã xác nhận mới đã được gửi đến email của bạn.');
      } else {
        Alert.alert('Lỗi', response.error || 'Không thể gửi lại mã xác nhận.');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login');
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
          Nhập mã xác nhận đã được gửi đến{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Verification Code Input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mã xác nhận</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.verificationCode
                    ? '#ff4444'
                    : Colors[colorScheme].tabIconDefault,
                  color: Colors[colorScheme].text,
                  backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                },
              ]}
              placeholder="Nhập mã xác nhận"
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={verificationCode}
              onChangeText={(text) => {
                setVerificationCode(text);
                if (errors.verificationCode) setErrors({ ...errors, verificationCode: undefined });
              }}
              keyboardType="default"
              autoCapitalize="none"
            />
            {errors.verificationCode && (
              <Text style={styles.errorText}>{errors.verificationCode}</Text>
            )}
          </View>

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

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: Colors[colorScheme].text }]}>
              Không nhận được mã?{' '}
            </Text>
            <TouchableOpacity onPress={handleResendCode} disabled={loading}>
              <Text style={[styles.resendLink, { color: Colors[colorScheme].tint }]}>
                Gửi lại
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={[styles.backLink, { color: Colors[colorScheme].tint }]}>
                ← Quay lại đăng nhập
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
