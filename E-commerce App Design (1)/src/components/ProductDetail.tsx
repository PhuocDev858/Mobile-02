import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const product = products.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
          <button
            onClick={() => onNavigate('products')}
            className="text-blue-600 hover:underline"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>Đã thêm sản phẩm vào giỏ hàng!</span>
            <button
              onClick={() => onNavigate('cart')}
              className="text-green-800 underline hover:no-underline"
            >
              Xem giỏ hàng
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviews} đánh giá)</span>
                <span className="text-gray-300">|</span>
                {product.stock > 0 ? (
                  <span className="text-green-600">Còn {product.stock} sản phẩm</span>
                ) : (
                  <span className="text-red-600">Hết hàng</span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-blue-600 mb-2">{formatPrice(product.price)}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-gray-900 mb-4">Thông số kỹ thuật</h3>
                <div className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-700">Số lượng:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-900 w-12 text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
