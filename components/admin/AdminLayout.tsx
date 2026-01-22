import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    useWindowDimensions,
    View
} from 'react-native';
import AdminDashboard from './AdminDashboard';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Analytics from './Analytics';
import CategoryManagement from './CategoryManagement';
import CustomerManagement from './CustomerManagement';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';

type AdminPage = 'dashboard' | 'categories' | 'products' | 'orders' | 'customers' | 'analytics';

interface AdminLayoutProps {
  currentPage?: AdminPage;
  onPageChange?: (page: AdminPage) => void;
}

export default function AdminLayout({ currentPage = 'dashboard', onPageChange }: AdminLayoutProps) {
  const [activePage, setActivePage] = useState<AdminPage>(currentPage);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: string) => {
    setActivePage(page as AdminPage);
    onPageChange?.(page as AdminPage);
    if (isSmallScreen) {
      setSidebarVisible(false);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'categories':
        return <CategoryManagement />;
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

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {!isSmallScreen && (
        <View style={styles.sidebarContainer}>
          <AdminSidebar
            currentPage={activePage}
            onNavigate={handlePageChange}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <AdminHeader
            onMenuClick={() => setSidebarVisible(!sidebarVisible)}
            onLogout={() => {}}
            currentPage={activePage}
          />
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {renderContent()}
        </View>
      </View>

      {/* Mobile Sidebar Overlay */}
      {isSmallScreen && sidebarVisible && (
        <View style={styles.mobileOverlay}>
          <AdminSidebar
            currentPage={activePage}
            onNavigate={handlePageChange}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
  },
  sidebarContainer: {
    width: 280,
    backgroundColor: '#1f2937',
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#1f2937',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
