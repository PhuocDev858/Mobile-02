import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    setUser(mockUser);
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
    };
    
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
