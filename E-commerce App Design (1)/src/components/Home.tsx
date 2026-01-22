import { Laptop, Smartphone, Tablet, Headphones, Watch, Camera, ArrowRight, Star } from 'lucide-react';
import { categories, products } from '../data/products';

interface HomeProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const iconMap: Record<string, any> = {
    Laptop,
    Smartphone,
    Tablet,
    Headphones,
    Watch,
    Camera,
  };

  const featuredProducts = products.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">
              Cửa hàng công nghệ hàng đầu Việt Nam
            </h1>
            <p className="text-blue-100 mb-8 text-lg">
              Khám phá những sản phẩm công nghệ mới nhất với giá tốt nhất. 
              Chất lượng đảm bảo, giao hàng nhanh chóng.
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Mua sắm ngay
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-gray-900 mb-8">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => onNavigate('products', { category: category.id })}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-900 text-center">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-gray-900">Sản phẩm nổi bật</h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
            >
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onNavigate('product-detail', { productId: product.id })}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-700">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews})</span>
                  </div>
                  <p className="text-blue-600">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Chính hãng 100%</h3>
            <p className="text-gray-600">Cam kết sản phẩm chính hãng, bảo hành đầy đủ</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Giao hàng nhanh</h3>
            <p className="text-gray-600">Giao hàng toàn quốc, nhanh chóng trong 1-3 ngày</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Giá tốt nhất</h3>
            <p className="text-gray-600">Cam kết giá tốt nhất thị trường, hoàn tiền nếu có chênh lệch</p>
          </div>
        </div>
      </div>
    </div>
  );
}
