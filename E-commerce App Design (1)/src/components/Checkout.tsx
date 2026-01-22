import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress } from '../types';
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    district: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 1000);
  };

  if (cart.length === 0 && step !== 'success') {
    onNavigate('cart');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-gray-900 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã mua sắm tại TechStore. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Người nhận:</span>
                  <span className="text-gray-900">{shippingInfo.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="text-gray-900">{shippingInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thanh toán:</span>
                  <span className="text-gray-900">
                    {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ tín dụng'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onNavigate('home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 mb-8">Thanh toán</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'shipping' || step === 'payment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <span className="ml-2 text-gray-700">Thông tin giao hàng</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'payment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="ml-2 text-gray-700">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-gray-900 mb-6">Thông tin giao hàng</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Quận/Huyện</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.district}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, district: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tiếp tục
                  </button>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-gray-900 mb-6">Phương thức thanh toán</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <div className="text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <div className="text-gray-900">Thẻ tín dụng/Ghi nợ</div>
                        <div className="text-gray-600">Thanh toán qua cổng thanh toán an toàn</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Đặt hàng
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-gray-900 mb-6">Đơn hàng của bạn</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 line-clamp-2">{item.product.name}</p>
                      <p className="text-gray-600">x{item.quantity}</p>
                    </div>
                    <p className="text-gray-900 flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
