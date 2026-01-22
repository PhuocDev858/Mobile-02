import { AdminProvider } from '@/context/admin/AdminContext';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AdminProvider>
  );
}
