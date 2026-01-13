import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { products } from '@/data/products';
import { Colors } from '@/constants/theme';

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const product = useMemo(() => products.find((p) => p.id === productId), [productId]);

  if (!product) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
        </View>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Quay lại</Text>
      </TouchableOpacity>

      {/* Success Message */}
      {showSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>✓ Đã thêm sản phẩm vào giỏ hàng!</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Title */}
          <Text style={styles.title}>{product.name}</Text>

          {/* Rating and Stock */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingSection}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingNumber}>{product.rating}</Text>
            </View>
            <Text style={styles.reviewCount}>({product.reviews} đánh giá)</Text>
            <View style={styles.separator} />
            {product.stock > 0 ? (
              <Text style={styles.inStock}>Còn {product.stock} sản phẩm</Text>
            ) : (
              <Text style={styles.outOfStock}>Hết hàng</Text>
            )}
          </View>

          {/* Price */}
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.specsSection}>
            <Text style={styles.specsTitle}>Thông số kỹ thuật</Text>
            <View style={styles.specsList}>
              {Object.entries(product.specs).map(([key, value], index) => (
                <View key={key}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                  {index < Object.entries(product.specs).length - 1 && (
                    <View style={styles.specDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Số lượng:</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncreaseQuantity}
                disabled={quantity >= product.stock}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              product.stock === 0 && styles.addToCartButtonDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addToCartButtonText}>
                {product.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  successMessage: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    fontSize: 18,
    color: '#facc15',
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#e5e5e5',
  },
  inStock: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  outOfStock: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 16,
  },
  descriptionSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  specsSection: {
    marginBottom: 20,
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  specsList: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  specItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  specLabel: {
    flex: 0.4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  specValue: {
    flex: 0.6,
    fontSize: 14,
    color: '#1a1a1a',
  },
  specDivider: {
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  quantityValue: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
