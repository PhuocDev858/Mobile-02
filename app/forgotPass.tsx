import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
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

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPassScreen() {
  const colorScheme = 'light';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await authService.forgotPassword({ email });

        console.log('📧 Forgot Password Response:', response);

        if (response.data || response.status === 200) {
          // Gửi email thành công
          Alert.alert(
            'Thành công',
            'Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Chuyển đến màn hình reset password
                  router.push({
                    pathname: '/reset-password',
                    params: { email },
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert('Lỗi', response.error || 'Không thể gửi email. Vui lòng thử lại.');
        }
      } catch (error: any) {
        console.error('Forgot password error:', error);
        Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại');
      } finally {
        setLoading(false);
      }
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
        <Text style={[styles.title, { color: '#66ccff' }]}>Quên mật khẩu</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].tabIconDefault }]}>
          Nhập email của bạn để nhận mã xác nhận
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.email ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                  color: Colors[colorScheme].text,
                  backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                },
              ]}
              placeholder="Nhập email của bạn"
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleForgotPassword}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInButtonText}>Gửi mã xác nhận</Text>
            )}
          </TouchableOpacity>

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
  signInButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
