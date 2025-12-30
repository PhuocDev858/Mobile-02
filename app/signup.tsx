import { Colors } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignUpScreen() {
    const colorScheme = 'light';
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: string; username?: string; email?: string; password?: string; confirmPassword?: string }>({});

    const validateForm = () => {
        const newErrors: { fullName?: string; username?: string; email?: string; password?: string; confirmPassword?: string } = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Họ tên không được để trống';
        }

        if (!username.trim()) {
            newErrors.username = 'Username không được để trống';
        } else if (username.length < 3) {
            newErrors.username = 'Username phải có ít nhất 3 ký tự';
        }

        if (!email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password.trim()) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await authService.signup({
                    fullName,
                    username,
                    email,
                    password,
                    confirmPassword,
                });
                
                if (response.data) {
                    Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
                    router.replace('/(tabs)');
                }
            } catch (error: any) {
                console.error('Signup error:', error);
                const errorMessage = error?.response?.data?.message || error?.message || 'Đăng ký thất bại';
                Alert.alert('Lỗi', errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };
    const handleSignIn = () => {
        router.push('/login');
    };
    const handleBackToLogin = () => {
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
                    <Text style={[styles.backButtonText, { color: Colors[colorScheme].tint }]}>← </Text>
                </TouchableOpacity>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image source={require('@/assets/images/logo.png')} style={styles.logoImage} />
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Tạo tài khoản</Text>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Full Name Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Họ tên</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.fullName ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                                    color: Colors[colorScheme].text,
                                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                                },
                            ]}
                            placeholder="Nhập họ tên của bạn"
                            placeholderTextColor={Colors[colorScheme].tabIconDefault}
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                            }}
                        />
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

                    {/* Username Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Username</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.username ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                                    color: Colors[colorScheme].text,
                                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                                },
                            ]}
                            placeholder="Nhập username của bạn"
                            placeholderTextColor={Colors[colorScheme].tabIconDefault}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (errors.username) setErrors({ ...errors, username: undefined });
                            }}
                        />
                        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                    </View>

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

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Mật khẩu</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.password ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                                    color: Colors[colorScheme].text,
                                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                                },
                            ]}
                            placeholder="Nhập mật khẩu của bạn"
                            placeholderTextColor={Colors[colorScheme].tabIconDefault}
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Xác nhận mật khẩu</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.confirmPassword ? '#ff4444' : Colors[colorScheme].tabIconDefault,
                                    color: Colors[colorScheme].text,
                                    backgroundColor: Colors[colorScheme].tabIconDefault + '10',
                                },
                            ]}
                            placeholder="Xác nhận mật khẩu của bạn"
                            placeholderTextColor={Colors[colorScheme].tabIconDefault}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                            }}
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[styles.signUpButton, { backgroundColor: Colors[colorScheme].tint, opacity: loading ? 0.6 : 1 }]}
                        onPress={handleSignUp}
                        disabled={loading}>
                        <Text style={styles.signUpButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
                    </TouchableOpacity>

                    <View style={styles.signInContainer}>
                        <Text style={[styles.signInText, { color: Colors[colorScheme].text }]}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={handleSignIn}>
                            <Text style={[styles.signInLink, { color: Colors[colorScheme].tint }]}>Đăng nhập ngay</Text>
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 30,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    signUpButton: {
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        fontSize: 14,
    },
    signInLink: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
});
