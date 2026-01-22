import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAdmin } from '../../context/admin/AdminContext';

export default function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
  });

  // Lọc danh mục
  const filteredCategories = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Smart pagination
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

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }

    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', icon: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug || '',
      icon: category.icon || '',
      description: category.description || '',
    });
    setEditingId(category.id);
    setModalVisible(true);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa danh mục "${name}"?`,
      [
        { text: 'Hủy', onPress: () => {} },
        {
          text: 'Xóa',
          onPress: () => deleteCategory(id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý Danh mục</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm danh mục..."
          placeholderTextColor="#9ca3af"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* List */}
      <FlatList
        data={paginatedCategories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.icon || '📁'}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categorySlug}>{item.slug || 'Không có'}</Text>
                {item.description && (
                  <Text style={styles.categoryDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
                {item.productCount !== undefined && (
                  <Text style={styles.productCount}>
                    {item.productCount} sản phẩm
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="pencil" size={20} color="#7c3aed" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {searchText ? 'Không tìm thấy danh mục' : 'Không có danh mục nào'}
            </Text>
          </View>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.disabled]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pagesScroll}
          >
            {getPaginationPages().map((page, idx) => (
              <React.Fragment key={idx}>
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
              </React.Fragment>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.disabled,
            ]}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? 'Sửa Danh mục' : 'Thêm Danh mục'}
            </Text>
            <TouchableOpacity onPress={handleAddCategory}>
              <Text style={styles.modalSave}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Tên */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên danh mục *</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Điện thoại"
                placeholderTextColor="#d1d5db"
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Slug */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Slug</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: dien-thoai"
                placeholderTextColor="#d1d5db"
                value={formData.slug}
                onChangeText={text => setFormData({ ...formData, slug: text })}
              />
            </View>

            {/* Icon */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Icon (Emoji)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 📱"
                placeholderTextColor="#d1d5db"
                value={formData.icon}
                onChangeText={text => setFormData({ ...formData, icon: text })}
                maxLength={2}
              />
            </View>

            {/* Mô tả */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Mô tả danh mục..."
                placeholderTextColor="#d1d5db"
                value={formData.description}
                onChangeText={text =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#1f2937',
    fontSize: 14,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  categorySlug: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  productCount: {
    fontSize: 12,
    color: '#7c3aed',
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagesScroll: {
    flex: 1,
    maxHeight: 40,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pageButtonActive: {
    backgroundColor: '#7c3aed',
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  pageTextActive: {
    color: '#fff',
  },
  ellipsis: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textarea: {
    minHeight: 100,
  },
});
