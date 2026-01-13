import { useCart } from '@/context/CartContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import paymentService, { PaymentMethod } from '@/services/payment.service';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = paymentService.getPaymentMethods();
  const totalAmount = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePayment = async () => {
    // Kiểm tra thông tin
    if (!selectedPaymentMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (!shippingAddress.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setLoading(true);

    try {
      // Chuyển đổi cart items sang order items
      const orderItems = paymentService.convertCartToOrderItems(cartItems);

      // Tạo đơn hàng
      const orderData = {
        items: orderItems,
        totalAmount,
        paymentMethod: selectedPaymentMethod.id,
        shippingAddress,
        phoneNumber,
        notes,
      };

      const order = await paymentService.createOrder(orderData);

      // Nếu thanh toán chuyển khoản, hiển thị thông tin
      if (selectedPaymentMethod.type === 'bank_transfer') {
        router.push({
          pathname: '/payment-info',
          params: {
            orderId: order.orderId,
            orderCode: order.orderCode,
            bankName: selectedPaymentMethod.name,
            accountNumber: selectedPaymentMethod.accountNumber,
            accountName: selectedPaymentMethod.accountName,
            amount: totalAmount.toString(),
            content: paymentService.generateTransferContent(order.orderCode),
          },
        });
      } else if (selectedPaymentMethod.type === 'cod') {
        // COD - đơn hàng đã được tạo
        Alert.alert(
          'Đặt hàng thành công!',
          `Mã đơn hàng: ${order.orderCode}\nTổng tiền: ${formatPrice(totalAmount)}\n\nBạn sẽ thanh toán khi nhận hàng.`,
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
        // Ví điện tử - chuyển đến trang thanh toán
        Alert.alert('Thông báo', 'Chức năng đang được phát triển');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Thông tin đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Thông tin đơn hàng</Text>
          <View style={styles.orderSummary}>
            <Text style={styles.orderText}>Số sản phẩm: {cartItems.length}</Text>
            <Text style={styles.orderTotal}>
              Tổng tiền: <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
            </Text>
          </View>
        </View>

        {/* Thông tin giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Thông tin giao hàng</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Địa chỉ giao hàng *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập địa chỉ nhận hàng"
              placeholderTextColor="#999"
              value={shippingAddress}
              onChangeText={setShippingAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ghi chú (tùy chọn)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ghi chú cho đơn hàng"
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod?.id === method.id && styles.paymentMethodCardActive,
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <View style={styles.paymentMethodLeft}>
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <View>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  {method.accountNumber && (
                    <Text style={styles.paymentMethodDetail}>
                      STK: {method.accountNumber}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedPaymentMethod?.id === method.id && styles.radioActive,
                ]}
              >
                {selectedPaymentMethod?.id === method.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer - Nút thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1B6BCF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderSummary: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  orderText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  paymentMethodCardActive: {
    borderColor: '#1B6BCF',
    borderWidth: 2,
    backgroundColor: '#eff6ff',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentMethodDetail: {
    fontSize: 12,
    color: '#6b7280',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#1B6BCF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B6BCF',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
  },
  payButton: {
    backgroundColor: '#1B6BCF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
