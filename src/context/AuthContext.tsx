import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { UserStorage } from '../services/UserStorage';

const SESSION_KEY = 'userToken';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (fullName: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore session on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(SESSION_KEY);
        if (storedEmail) {
          const user = await UserStorage.findByEmail(storedEmail);
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Stale session; clear it
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (e) {
        console.error('Failed to restore session', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  /**
   * Returns null on success, or an error message string on failure.
   */
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      const user = await UserStorage.findByEmail(email);
      if (!user || user.password !== password) {
        return 'Invalid email or password.';
      }
      await AsyncStorage.setItem(SESSION_KEY, user.email);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return null;
    } catch (e) {
      console.error('Login error', e);
      return 'Something went wrong. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Returns null on success, or an error message string on failure.
   */
  const signup = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      setIsLoading(true);
      const existing = await UserStorage.findByEmail(email);
      if (existing) {
        return 'An account with this email already exists.';
      }

      const newUser: User = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        fullName,
        email,
        password,
      };

      await UserStorage.addUser(newUser);
      await AsyncStorage.setItem(SESSION_KEY, newUser.email);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      return null;
    } catch (e) {
      console.error('Signup error', e);
      return 'Something went wrong. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(SESSION_KEY);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, currentUser, login, signup, logout }}
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
