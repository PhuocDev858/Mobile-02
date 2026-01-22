import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, X } from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Sản phẩm', icon: Package },
  { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
  { id: 'customers', label: 'Khách hàng', icon: Users },
  { id: 'analytics', label: 'Phân tích', icon: BarChart3 },
];

export default function AdminSidebar({
  currentPage,
  onNavigate,
  sidebarOpen,
  setSidebarOpen
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h1 className="text-xl font-bold">Tech Store</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-400">Phiên bản</p>
            <p className="text-sm font-medium">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
