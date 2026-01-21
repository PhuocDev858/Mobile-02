import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useCart } from '@/context/CartContext';
import { useProductData } from '@/context/ProductDataContext';
import { useSelectedCategory } from '@/context/SelectedCategoryContext';
import { Product } from '@/data/products';

// Icon map for categories
const categoryIcons: Record<string, string> = {
  'Laptop': '💻',
  'Smartphone': '📱',
  'Tablet': '📑',
  'Headphones': '🎧',
  'Watch': '⌚',
  'Camera': '📷',
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { categories, allProducts, loading, refreshData } = useProductData();
  const { selectedCategoryId, setSelectedCategoryId } = useSelectedCategory();
  const cartCount = getTotalItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId);
  const [sortBy, setSortBy] = useState<string>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Cập nhật selectedCategory khi selectedCategoryId từ context thay đổi
  useEffect(() => {
    setSelectedCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Hiển thị gợi ý sản phẩm khi người dùng nhập
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const suggestions = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setSuggestions(suggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  // Thực hiện tìm kiếm đầy đủ khi người dùng bấm nút tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setIsSearching(true);
      setSuggestions([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSuggestions([]);
  };

  useEffect(() => {
    // Filter and sort products
    if (!allProducts || !Array.isArray(allProducts)) {
      return;
    }
    
    let result = [...allProducts];

    // Filter out out-of-stock products
    result = result.filter((p: any) => {
      const stock = p.stockQuantity || p.stock || 0;
      return stock > 0;
    });

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p: any) => {
        // So sánh trực tiếp cả hai dưới dạng number hoặc string
        return p.categoryId == selectedCategory;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, allProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButtonIcon}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && !isSearching && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchQuery(item.name);
                  handleSearch();
                }}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B6BCF" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : isSearching ? (
        // Hiển thị kết quả tìm kiếm
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1B6BCF']}
            />
          }
        >
          <View style={styles.searchResultsSection}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.resultsText}>
                {searchResults.length} sản phẩm tìm được cho "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={handleClearSearch}>
                <Text style={styles.clearSearchText}>Xóa</Text>
              </TouchableOpacity>
            </View>

            {!searchResults || searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.productGrid}
                renderItem={({ item }) => {
                  const productItem = item as any;
                  return (
                    <TouchableOpacity 
                      style={styles.productCard}
                      onPress={() => router.push({
                        pathname: '/product-detail',
                        params: { productId: item.id }
                      })}
                    >
                      <Image
                        source={{ uri: productItem.imageUrl || productItem.image }}
                        style={styles.productImage}
                        contentFit="cover"
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                        <View style={styles.ratingRow}>
                          <Text style={styles.starIcon}>★</Text>
                          <Text style={styles.rating}>{productItem.rating || 0}</Text>
                          <Text style={styles.reviews}>({productItem.reviews || 0})</Text>
                        </View>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        // Hiển thị danh mục và lọc bình thường
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1B6BCF']}
            />
          }
        >
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>🔍 Lọc theo danh mục</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          >
            {/* All categories button */}
            <TouchableOpacity 
              key="all"
              style={[
                styles.filterButton,
                selectedCategory === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedCategory === 'all' && styles.filterButtonTextActive
              ]}>Tất cả</Text>
            </TouchableOpacity>

            {categories && categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[
                  styles.filterButton,
                  selectedCategory === category.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedCategory === category.id && styles.filterButtonTextActive
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Section */}
        <View style={styles.sortSection}>
          <Text style={styles.sortTitle}>⬍ Sắp xếp</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.sortList}
          >
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'default' && styles.sortButtonActive]}
              onPress={() => setSortBy('default')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'default' && styles.sortButtonTextActive]}>Mặc định</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'price-low' && styles.sortButtonActive]}
              onPress={() => setSortBy('price-low')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'price-low' && styles.sortButtonTextActive]}>Giá ↑</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'price-high' && styles.sortButtonActive]}
              onPress={() => setSortBy('price-high')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'price-high' && styles.sortButtonTextActive]}>Giá ↓</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>Đánh giá</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.resultsText}>
            Hiển thị {filteredProducts?.length || 0} sản phẩm
          </Text>

          {!filteredProducts || filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={styles.productGrid}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              removeClippedSubviews={true}
              renderItem={({ item }) => {
                const productItem = item as any;
                return (
                <TouchableOpacity 
                  style={styles.productCard}
                  onPress={() => router.push({
                    pathname: '/product-detail',
                    params: { productId: item.id }
                  })}
                >
                  <Image
                    source={{ uri: productItem.imageUrl || productItem.image }}
                    style={styles.productImage}
                    contentFit="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.starIcon}>★</Text>
                      <Text style={styles.rating}>{productItem.rating || 0}</Text>
                      <Text style={styles.reviews}>({productItem.reviews || 0})</Text>
                    </View>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                  </View>
                </TouchableOpacity>
              )}}
            />
          )}
        </View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 40,
    fontSize: 14,
    color: '#333',
  },
  searchButtonIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -9,
    padding: 8,
  },
  suggestionsContainer: {
    maxHeight: 250,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  cartButton: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
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
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  backButton: {
    fontSize: 24,
    color: '#1B6BCF',
    fontWeight: 'bold',
    paddingRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#1B6BCF',
    borderColor: '#1B6BCF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  sortSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sortList: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonActive: {
    backgroundColor: '#1B6BCF',
    borderColor: '#1B6BCF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
    fontWeight: '500',
  },
  clearSearchText: {
    color: '#1B6BCF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  productGrid: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
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
