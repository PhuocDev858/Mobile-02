import { Menu, Bell, LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  onMenuClick: () => void;
}

export default function AdminHeader({ onLogout, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center: Empty on mobile, could add search */}
        <div className="hidden lg:block flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Quản trị viên</h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
