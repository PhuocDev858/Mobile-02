import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
              <span>TechStore</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-700'
              } hover:text-blue-600 transition-colors`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`${
                currentPage === 'products' || currentPage === 'product-detail'
                  ? 'text-blue-600'
                  : 'text-gray-700'
              } hover:text-blue-600 transition-colors`}
            >
              Sản phẩm
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  onNavigate('products');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Sản phẩm
              </button>
              {user ? (
                <>
                  <div className="px-3 py-2 text-gray-700 border-t">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded border-t"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('register');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
