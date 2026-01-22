import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/components/admin/AdminLogin';
import { useAdmin } from '@/context/admin/AdminContext';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AdminScreen() {
  const { loading, products, orders, customers } = useAdmin();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  console.log('🎯 Admin data loaded:', {
    productsCount: products.length,
    ordersCount: orders.length,
    customersCount: customers.length,
  });

  return (
    <AdminLayout
      currentPage="dashboard"
      onPageChange={() => {}}
    />
  );
}
