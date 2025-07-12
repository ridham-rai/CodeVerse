import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isEmailRegistered: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('codeEditor_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('codeEditor_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          email: 'demo@example.com',
          name: 'Demo User',
          avatar: '👨‍💻'
        };
        setUser(demoUser);
        localStorage.setItem('codeEditor_user', JSON.stringify(demoUser));
        return true;
      }

      // Check if user exists in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('codeEditor_registeredUsers') || '[]');
      const existingUser = registeredUsers.find((user: any) =>
        user.email === email && user.password === password
      );

      if (existingUser) {
        const loginUser: User = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          avatar: existingUser.avatar || '👤'
        };
        setUser(loginUser);
        localStorage.setItem('codeEditor_user', JSON.stringify(loginUser));
        return true;
      }

      // User not found or wrong credentials
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('codeEditor_registeredUsers') || '[]');
      const existingUser = registeredUsers.find((user: any) => user.email === email);

      if (existingUser) {
        // User already exists
        return false;
      }

      // Validate input
      if (email && password.length >= 6 && name) {
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name,
          password, // Store password for demo purposes (in real app, this would be hashed)
          avatar: '👤',
          createdAt: new Date().toISOString()
        };

        // Add to registered users
        registeredUsers.push(newUser);
        localStorage.setItem('codeEditor_registeredUsers', JSON.stringify(registeredUsers));

        // Set as current user
        const currentUser: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar
        };
        setUser(currentUser);
        localStorage.setItem('codeEditor_user', JSON.stringify(currentUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codeEditor_user');
  };

  const isEmailRegistered = (email: string): boolean => {
    const registeredUsers = JSON.parse(localStorage.getItem('codeEditor_registeredUsers') || '[]');
    return registeredUsers.some((user: any) => user.email === email) || email === 'demo@example.com';
  };

  // Debug function to clear all registered users (for testing)
  const clearAllUsers = () => {
    localStorage.removeItem('codeEditor_registeredUsers');
    console.log('All registered users cleared');
  };

  // Add to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).clearAllUsers = clearAllUsers;
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    isEmailRegistered,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
