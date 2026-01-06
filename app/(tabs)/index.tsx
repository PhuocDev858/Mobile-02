import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, FlatList } from 'react-native';

import { authService } from '@/services/auth.service';
import { categories, products } from '@/data/products';

export default function HomeScreen() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<{ username?: string; email?: string; name?: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleLogout = () => {
    // Clear user data and navigate back to login
    setShowMenu(false);
    router.replace('/login');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* User Header */}
      <View style={styles.headerContainer}>
        <View style={styles.spacer} />
        <TouchableOpacity 
          style={styles.avatarButton}
          onPress={() => setShowMenu(!showMenu)}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Cửa hàng công nghệ hàng đầu Việt Nam</Text>
          <Text style={styles.heroSubtitle}>
            Khám phá những sản phẩm công nghệ mới nhất với giá tốt nhất. Chất lượng đảm bảo, giao hàng nhanh chóng.
          </Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryIcon}>
                  {/* Icon placeholder - có thể thay bằng icon thực */}
                  <Text style={styles.categoryIconText}>📦</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.productGrid}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  contentFit="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.starIcon}>★</Text>
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.reviews}>({item.reviews})</Text>
                  </View>
                  <Text style={styles.price}>{formatPrice(item.price)}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>✓</Text>
            </View>
            <Text style={styles.featureTitle}>Chính hãng 100%</Text>
            <Text style={styles.featureText}>Cam kết sản phẩm chính hãng, bảo hành đầy đủ</Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>⚡</Text>
            </View>
            <Text style={styles.featureTitle}>Giao hàng nhanh</Text>
            <Text style={styles.featureText}>Giao hàng toàn quốc, nhanh chóng trong 1-3 ngày</Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>💰</Text>
            </View>
            <Text style={styles.featureTitle}>Giá tốt nhất</Text>
            <Text style={styles.featureText}>Cam kết giá tốt nhất thị trường, hoàn tiền nếu có chênh lệch</Text>
          </View>
        </View>
      </ScrollView>

      {/* Dropdown Menu - Rendered outside ScrollView */}
      {showMenu && (
        <>
          <TouchableOpacity 
            style={styles.overlay}
            onPress={() => setShowMenu(false)}
            activeOpacity={1}
          />
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              {/* User Info Section */}
              <View style={styles.userInfoSection}>
                {user ? (
                  <>
                    <Text style={styles.usernameText}>{user.username || 'User'}</Text>
                    <Text style={styles.emailText}>{user.email || ''}</Text>
                  </>
                ) : (
                  <ActivityIndicator size="small" color="#1B6BCF" />
                )}
              </View>
              <View style={styles.menuDivider} />
              {/* Logout Option */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleLogout}>
                <Text style={styles.menuItemText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  spacer: {
    flex: 1,
  },
  avatarButton: {
    position: 'relative',
    zIndex: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B6BCF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 100,
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 180,
  },
  userInfoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // Hero Section
  heroSection: {
    backgroundColor: '#1B6BCF',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 16,
    lineHeight: 20,
  },
  heroButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#1B6BCF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Categories Section
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoriesList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Featured Products Section
  featuredSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    color: '#1B6BCF',
    fontSize: 12,
    fontWeight: '600',
  },
  productGrid: {
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 12,
    color: '#FBBF24',
  },
  rating: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B6BCF',
  },
  // Features Section
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  featureCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
