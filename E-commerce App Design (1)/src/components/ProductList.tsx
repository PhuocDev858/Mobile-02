import { useState, useEffect } from 'react';
import { Star, Filter } from 'lucide-react';
import { products, categories } from '../data/products';
import { Product } from '../types';

interface ProductListProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: string;
}

export function ProductList({ onNavigate, initialCategory }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
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
  }, [selectedCategory, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 mb-8">Sản phẩm</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h3 className="text-gray-900">Bộ lọc</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-3">Danh mục</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Tất cả
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-3">Sắp xếp</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-low">Giá: Thấp đến cao</option>
                    <option value="price-high">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-gray-600">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-600">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onNavigate('product-detail', { productId: product.id })}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700">{product.rating}</span>
                        <span className="text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-600">{formatPrice(product.price)}</p>
                        {product.stock > 0 ? (
                          <span className="text-green-600">Còn hàng</span>
                        ) : (
                          <span className="text-red-600">Hết hàng</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
