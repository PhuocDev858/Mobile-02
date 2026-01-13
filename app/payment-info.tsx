import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCart } from '@/context/CartContext';
import paymentService from '@/services/payment.service';

export default function PaymentInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { clearCart } = useCart();

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 phút

  const orderId = params.orderId as string;
  const orderCode = params.orderCode as string;
  const bankName = params.bankName as string;
  const accountNumber = params.accountNumber as string;
  const accountName = params.accountName as string;
  const amount = parseFloat(params.amount as string);
  const content = params.content as string;

  useEffect(() => {
    // Tạo QR code
    const bankCode = getBankCode(bankName);
    const qrUrl = paymentService.generateBankQRCode(
      bankCode,
      accountNumber,
      accountName,
      amount,
      content
    );
    setQrCodeUrl(qrUrl);

    // Đếm ngược thời gian
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBankCode = (name: string): string => {
    if (name.includes('Vietcombank')) return 'VCB';
    if (name.includes('Techcombank')) return 'TCB';
    if (name.includes('MB Bank')) return 'MB';
    return 'VCB';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Đã sao chép', `${label} đã được sao chép vào clipboard`);
  };

  const handleCheckPayment = async () => {
    setChecking(true);
    try {
      const status = await paymentService.checkPaymentStatus(orderId);
      
      if (status.status === 'paid') {
        Alert.alert(
          'Thanh toán thành công!',
          'Đơn hàng của bạn đã được xác nhận thanh toán.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Chưa nhận được thanh toán',
          'Chúng tôi chưa nhận được thanh toán của bạn. Vui lòng kiểm tra lại sau vài phút.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể kiểm tra trạng thái thanh toán');
    } finally {
      setChecking(false);
    }
  };

  const handleCancelPayment = () => {
    Alert.alert(
      'Hủy thanh toán',
      'Bạn có chắc muốn hủy thanh toán? Đơn hàng sẽ bị hủy.',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đơn',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentService.cancelOrder(orderId, 'Người dùng hủy thanh toán');
              router.replace('/(tabs)/cart');
            } catch (error: any) {
              Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông tin thanh toán</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>Thời gian còn lại:</Text>
          <Text style={styles.countdownTime}>{formatTime(countdown)}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>Quét mã QR để thanh toán</Text>
          {qrCodeUrl ? (
            <View style={styles.qrCodeContainer}>
              <Image
                source={{ uri: qrCodeUrl }}
                style={styles.qrCode}
                contentFit="contain"
              />
              <Text style={styles.qrHint}>
                Mở ứng dụng ngân hàng và quét mã QR
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#1B6BCF" />
          )}
        </View>

        {/* Thông tin chuyển khoản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoặc chuyển khoản thủ công</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngân hàng:</Text>
            <Text style={styles.infoValue}>{bankName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tài khoản:</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>{accountNumber}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(accountNumber, 'Số tài khoản')}
                style={styles.copyButton}
              >
                <Text style={styles.copyButtonText}>Sao chép</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chủ tài khoản:</Text>
            <Text style={styles.infoValue}>{accountName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tiền:</Text>
            <View style={styles.infoValueContainer}>
              <Text style={[styles.infoValue, styles.amountText]}>
                {formatPrice(amount)}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(amount.toString(), 'Số tiền')}
                style={styles.copyButton}
              >
                <Text style={styles.copyButtonText}>Sao chép</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nội dung:</Text>
            <View style={styles.infoValueContainer}>
              <Text style={[styles.infoValue, styles.contentText]}>{content}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(content, 'Nội dung chuyển khoản')}
                style={styles.copyButton}
              >
                <Text style={styles.copyButtonText}>Sao chép</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Lưu ý */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>⚠️ Lưu ý quan trọng:</Text>
          <Text style={styles.noteText}>
            • Vui lòng chuyển khoản đúng số tiền và nội dung để được xác nhận tự động
          </Text>
          <Text style={styles.noteText}>
            • Đơn hàng sẽ tự động hủy sau {formatTime(countdown)}
          </Text>
          <Text style={styles.noteText}>
            • Sau khi chuyển khoản, vui lòng nhấn "Kiểm tra thanh toán" để xác nhận
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.checkButton]}
          onPress={handleCheckPayment}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>✓ Kiểm tra thanh toán</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancelPayment}
        >
          <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  countdownContainer: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#B45309',
  },
  qrSection: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCode: {
    width: 280,
    height: 280,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  qrHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValueContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  amountText: {
    color: '#EF4444',
    fontSize: 16,
  },
  contentText: {
    color: '#1B6BCF',
    fontWeight: '700',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    marginLeft: 8,
  },
  copyButtonText: {
    fontSize: 12,
    color: '#1B6BCF',
    fontWeight: '600',
  },
  noteSection: {
    backgroundColor: '#FEF2F2',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#7F1D1D',
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkButton: {
    backgroundColor: '#1B6BCF',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
