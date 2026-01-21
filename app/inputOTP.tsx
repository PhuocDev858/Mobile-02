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
    View
} from 'react-native';

export default function InputOTPScreen() {
  const colorScheme = 'light';
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  console.log('Input OTP Screen loaded');
  console.log('Email from params:', email);

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{ otp?: string }>({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const validateOTP = () => {
    const newErrors: { otp?: string } = {};

    if (!otp.trim()) {
      newErrors.otp = 'Mã OTP không được để trống';
    } else if (otp.length !== 6) {
      newErrors.otp = 'Mã OTP phải đúng 6 chữ số';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'Mã OTP chỉ được chứa chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin email');
      return;
    }

    console.log('📧 Gửi mã OTP tới:', email);
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      console.log('📧 Send OTP Response:', response);

      if (response.data?.success || response.status === 200) {
        console.log('✅ OTP sent successfully');
        setOtpSent(true);
        Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn');
      } else {
        Alert.alert('Lỗi', response.data?.message || 'Không thể gửi mã OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) {
      console.log('❌ OTP validation failed');
      return;
    }

    console.log('✅ OTP validation passed');
    console.log('Email:', email);
    console.log('OTP:', otp);

    setLoading(true);
    try {
      console.log('Step 1: Verifying OTP...');
      const verifyResponse = await authService.verifyOTP(email, otp);
      console.log('🔍 Verify OTP Response:', JSON.stringify(verifyResponse, null, 2));

      if (verifyResponse.data?.success) {
        console.log('✅ OTP verified successfully');
        Alert.alert('Thành công', 'Mã OTP hợp lệ! Chuyển sang trang đặt lại mật khẩu.', [
          {
            text: 'Tiếp tục',
            onPress: () => {
              // Chuyển tới trang reset password
              router.replace({
                pathname: '/reset-password',
                params: { email, verified: 'true' },
              });
            },
          },
        ]);
      } else {
        console.log('❌ OTP verification failed');
        Alert.alert('Lỗi', verifyResponse.data?.message || 'Mã OTP không hợp lệ');
        setErrors({ otp: verifyResponse.data?.message || 'Mã OTP không hợp lệ' });
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
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
        <Text style={[styles.title, { color: '#66ccff' }]}>Xác thực OTP</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].tabIconDefault }]}>
          Nhập mã OTP 6 chữ số{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* OTP Input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mã OTP</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.otp ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                  color: Colors[colorScheme].text,
                  backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                },
              ]}
              placeholder="Nhập 6 chữ số"
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={otp}
              onChangeText={(text) => {
                // Chỉ cho nhập số, tối đa 6 ký tự
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                setOtp(numericText);
                if (errors.otp) setErrors({ ...errors, otp: undefined });
              }}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              autoCapitalize="none"
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
          </View>

          {/* Send OTP Button */}
          {!otpSent && (
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleSendOTP}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Gửi mã OTP</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Verify OTP Button - Show after OTP sent */}
          {otpSent && (
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleVerifyOTP}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Xác thực OTP</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Resend Code */}
          {otpSent && (
            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: Colors[colorScheme].text }]}>
                Không nhận được mã?{' '}
              </Text>
              <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
                <Text style={[styles.resendLink, { color: Colors[colorScheme].tint }]}>
                  Gửi lại
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
