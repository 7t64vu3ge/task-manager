import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_STORAGE_KEY = '@tasks_storage_v1';

export const TaskStorage = {
  /**
   * Saves the list of tasks to persistent storage.
   * Gracefully handles errors without crashing.
   */
  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving tasks to storage:', e);
    }
  },

  /**
   * Loads the list of tasks from persistent storage.
   * Returns an empty array if none exist or if an error occurs.
   */
  loadTasks: async (): Promise<Task[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading tasks from storage:', e);
      return [];
    }
  },
};
