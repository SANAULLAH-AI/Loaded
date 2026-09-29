
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  isGuest?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (name: string, email: string, username: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    username: 'johndoe',
    password: 'password123'
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    username: 'admin',
    password: 'admin123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }

      if (mockUsers.some(u => u.username === username)) {
        throw new Error('Username already taken');
      }
      
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        username
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const guestUser = {
        id: `guest-${Date.now()}`,
        name: 'Guest User',
        email: `guest-${Date.now()}@example.com`,
        isGuest: true
      };
      
      setUser(guestUser);
      localStorage.setItem('user', JSON.stringify(guestUser));
      toast.success('Logged in as guest');
    } catch (error) {
      toast.error('Guest login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        guestLogin,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
