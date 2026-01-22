import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Product, useAdmin } from '../../context/admin/AdminContext';

export default function ProductManagement() {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.price) {
      Alert.alert('Lỗi', 'Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    const data = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      image: formData.image,
      description: formData.description,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn xóa sản phẩm này?', [
      { text: 'Hủy', onPress: () => {} },
      { text: 'Xóa', onPress: () => deleteProduct(id) },
    ]);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Hết hàng', color: '#dc2626', bg: '#fee2e2' };
    if (stock < 10) return { text: 'Sắp hết', color: '#b45309', bg: '#fef3c7' };
    return { text: 'Còn hàng', color: '#166534', bg: '#dcfce7' };
  };

  // Tính các trang cần hiển thị
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxVisible - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quản lý sản phẩm</Text>
            <Text style={styles.subtitle}>{filteredProducts.length} sản phẩm</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleOpenModal()}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
          </View>
        ) : (
          <>
            {paginatedProducts.map((product, index) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <View
                  key={product.id}
                  style={[
                    styles.productCard,
                    index === paginatedProducts.length - 1 && styles.lastCard,
                  ]}
                >
                  <View style={styles.productHeader}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text style={styles.productCategory}>{product.category}</Text>
                    </View>
                    <View
                      style={[styles.statusBadge, { backgroundColor: stockStatus.bg }]}
                    >
                      <Text style={[styles.statusText, { color: stockStatus.color }]}>
                        {stockStatus.text}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.productMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Giá</Text>
                      <Text style={styles.metaValue}>${product.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Kho</Text>
                      <Text style={styles.metaValue}>{product.stock}</Text>
                    </View>
                  </View>

                  <View style={styles.productActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleOpenModal(product)}
                    >
                      <Ionicons name="pencil" size={16} color="#7c3aed" />
                      <Text style={styles.actionText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(product.id)}
                    >
                      <Ionicons name="trash" size={16} color="#dc2626" />
                      <Text style={[styles.actionText, { color: '#dc2626' }]}>
                        Xóa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#ccc' : '#7c3aed'} />
                </TouchableOpacity>

                <View style={styles.paginationInfo}>
                  {getPaginationPages().map((page, index) => (
                    <View key={index}>
                      {typeof page === 'number' ? (
                        <TouchableOpacity
                          style={[
                            styles.pageButton,
                            currentPage === page && styles.pageButtonActive,
                          ]}
                          onPress={() => setCurrentPage(page)}
                        >
                          <Text
                            style={[
                              styles.pageText,
                              currentPage === page && styles.pageTextActive,
                            ]}
                          >
                            {page}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.ellipsis}>{page}</Text>
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#ccc' : '#7c3aed'} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Product Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên sản phẩm</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên sản phẩm"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholderTextColor="#999"
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Danh mục *</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    { paddingHorizontal: 12, justifyContent: 'center', height: 48 },
                  ]}
                  onPress={() => setShowCategoryDropdown(true)}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: formData.category ? '#1f2937' : '#999',
                        fontSize: 14,
                      }}
                    >
                      {formData.category || 'Chọn danh mục'}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#7c3aed"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Price */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Giá</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) =>
                    setFormData({ ...formData, price: text })
                  }
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Stock */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Kho hàng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) =>
                    setFormData({ ...formData, stock: text })
                  }
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Nhập mô tả sản phẩm"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>
                  {editingProduct ? 'Cập nhật' : 'Thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <View style={styles.categoryPickerOverlay}>
          <View style={styles.categoryPickerContainer}>
            <View style={styles.categoryPickerHeader}>
              <Text style={styles.categoryPickerTitle}>Chọn Danh mục</Text>
              <TouchableOpacity onPress={() => setShowCategoryDropdown(false)}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryPickerList}>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPickerItem,
                      formData.category === cat.name && styles.categoryPickerItemActive,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, category: cat.name });
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.categoryPickerItemIcon}>{cat.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.categoryPickerItemName,
                          formData.category === cat.name && styles.categoryPickerItemNameActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                      {cat.productCount !== undefined && (
                        <Text style={styles.categoryPickerItemCount}>
                          {cat.productCount} sản phẩm
                        </Text>
                      )}
                    </View>
                    {formData.category === cat.name && (
                      <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noCategoriesContainer}>
                  <Ionicons name="folder-outline" size={48} color="#9ca3af" />
                  <Text style={styles.noCategoriesText}>Không có danh mục</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lastCard: {
    marginBottom: 0,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 12,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textarea: {
    minHeight: 100,
    paddingTop: 10,
  },
  statusToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#7c3aed',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  categoryPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  categoryPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingTop: 0,
  },
  categoryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryPickerList: {
    flex: 1,
  },
  categoryPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryPickerItemActive: {
    backgroundColor: '#f3f4f6',
  },
  categoryPickerItemIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryPickerItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  categoryPickerItemNameActive: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  categoryPickerItemCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  noCategoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1f2937',
  },
  dropdownItemTextActive: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  noCategoriesText: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paginationButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationInfo: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  pageButtonActive: {
    backgroundColor: '#7c3aed',
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pageTextActive: {
    color: '#fff',
  },
  ellipsis: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    paddingHorizontal: 4,
  },
  spacer: {
    height: 20,
  },
});
