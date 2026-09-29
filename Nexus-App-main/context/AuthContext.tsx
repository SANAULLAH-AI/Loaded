import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/services/api';

type User = {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
};

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loadStoredUser = async () => {
      try {
        // Simulate fetching stored user
        // In a real app, we'd use AsyncStorage or similar
        setTimeout(() => {
          const storedUser = null; // Simulate no stored user
          setUser(storedUser);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load user:', error);
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we'd make an API call to authenticate
      // For now, we'll use the users API to get a mock user
      const users = await api.getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return Promise.reject(new Error('User not found'));
      }
      
      // Create a user object with required fields
      const authUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        photoUrl: `https://randomuser.me/api/portraits/${foundUser.id % 2 === 0 ? 'men' : 'women'}/${foundUser.id}.jpg`,
      };
      
      setUser(authUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to sign in:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock user (in a real app, we'd make an API call to register)
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID
        name: `${firstName} ${lastName}`,
        email,
        photoUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
      };
      
      setUser(newUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to sign up:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Simulate sign out delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to sign out:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};