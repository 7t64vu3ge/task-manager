import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

const USERS_STORAGE_KEY = '@users';

export const UserStorage = {
  getUsers: async (): Promise<User[]> => {
    try {
      const json = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('UserStorage getUsers error:', e);
      throw new Error('Failed to load users from storage.');
    }
  },

  saveUsers: async (users: User[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('UserStorage saveUsers error:', e);
      throw new Error('Failed to save users to storage.');
    }
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    const users = await UserStorage.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser: async (user: User): Promise<void> => {
    const users = await UserStorage.getUsers();
    users.push(user);
    await UserStorage.saveUsers(users);
  },
};
