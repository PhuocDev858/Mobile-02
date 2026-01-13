import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';

import { useCart } from '@/context/CartContext';
import { categories, products } from '@/data/products';
import { authService } from '@/services/auth.service';

// Icon map for categories
const categoryIcons: Record<string, string> = {
  'Laptop': '💻',
  'Smartphone': '📱',
  'Tablet': '📑',
  'Headphones': '🎧',
  'Watch': '⌚',
  'Camera': '📷',
};

export default function HomeScreen() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<{ username?: string; email?: string; name?: string } | null>(null);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

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

  const featuredProducts = searchQuery.trim() === '' ? products.slice(0, 4) : filteredProducts;

  return (
    <>
      {/* Header with Search Bar and Cart Icon */}
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/(tabs)/cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
                  <Text style={styles.categoryIconText}>{categoryIcons[category.icon]}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim() === '' ? 'Sản phẩm nổi bật' : `Kết quả tìm kiếm (${filteredProducts.length})`}
            </Text>
            {searchQuery.trim() === '' && (
              <TouchableOpacity>
                <Text style={styles.viewAll}>Xem tất cả →</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.productGrid}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productCard}
                onPress={() => router.push({
                  pathname: '/product-detail',
                  params: { productId: item.id }
                })}
              >
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 12,
    paddingLeft: Platform.OS === 'android' ? 16 : 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  spacer: {
    flex: 1,
  },
  cartButton: {
    position: 'relative',
    zIndex: 10,
  },
  cartIcon: {
    fontSize: 28,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
});
