
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getFromStorage, saveToStorage, USER_KEY } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

// Define types
interface User {
  id: string;
  name: string;
  avatar: string;
  isKidsProfile: boolean;
  settings?: UserSettings;
}

export interface UserSettings {
  language: string;
  isDarkMode: boolean;
  autoplay: boolean;
  notifications: boolean;
  dataUsage: 'auto' | 'high' | 'medium' | 'low';
  parentalControls: boolean;
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  updateUserSettings: (userId: string, settings: Partial<UserSettings>) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  googleLogin: () => void;
}

const defaultSettings: UserSettings = {
  language: 'en',
  isDarkMode: true,
  autoplay: true,
  notifications: true,
  dataUsage: 'auto',
  parentalControls: false,
};

const defaultUsers = [
  { 
    id: '1', 
    name: 'Main Profile', 
    avatar: '1', 
    isKidsProfile: false,
    settings: defaultSettings 
  },
  { 
    id: '2', 
    name: 'Kids', 
    avatar: '2', 
    isKidsProfile: true,
    settings: {
      ...defaultSettings,
      parentalControls: true,
    }
  },
];

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load users from storage on mount
    const storedUsers = getFromStorage(USER_KEY);
    if (storedUsers) {
      // Ensure all users have settings
      const usersWithSettings = storedUsers.map((user: User) => ({
        ...user,
        settings: user.settings || defaultSettings
      }));
      setUsers(usersWithSettings);
    }
  }, []);

  // Save users whenever they change
  useEffect(() => {
    saveToStorage(USER_KEY, users);
  }, [users]);

  // Apply theme based on current user's settings
  useEffect(() => {
    if (currentUser?.settings?.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentUser?.settings?.isDarkMode]);

  const addUser = (user: User) => {
    // Ensure new user has settings
    const userWithSettings = {
      ...user,
      settings: user.settings || {
        ...defaultSettings,
        parentalControls: user.isKidsProfile
      }
    };
    setUsers((prevUsers) => [...prevUsers, userWithSettings]);
  };

  const removeUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => 
        user.id === userId ? { ...user, ...data } : user
      )
    );
    
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => prev ? { ...prev, ...data } : null);
    }
  };

  const updateUserSettings = (userId: string, settings: Partial<UserSettings>) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => 
        user.id === userId ? { 
          ...user, 
          settings: { ...(user.settings || defaultSettings), ...settings }
        } : user
      )
    );
    
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => prev ? { 
        ...prev, 
        settings: { ...(prev.settings || defaultSettings), ...settings }
      } : null);
    }
  };

  const login = (username: string, password: string) => {
    // Simplified login for demo
    if (username && password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const googleLogin = () => {
    // Simulated Google login
    setIsAuthenticated(true);
    toast({
      title: "Google Login",
      description: "Successfully logged in with Google",
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        setCurrentUser,
        addUser,
        removeUser,
        updateUser,
        updateUserSettings,
        login,
        googleLogin,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
