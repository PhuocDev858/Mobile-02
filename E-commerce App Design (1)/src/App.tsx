import { useState } from 'react';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import CustomerManagement from './components/admin/CustomerManagement';
import Analytics from './components/admin/Analytics';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="lg:pl-64">
          <AdminHeader
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="p-4 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
