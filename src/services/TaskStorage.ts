import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_STORAGE_KEY = '@tasks_storage_v1';

export const TaskStorage = {
  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('TaskStorage saveTasks error:', e);
      throw new Error('Failed to save tasks to local storage.');
    }
  },

  loadTasks: async (): Promise<Task[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('TaskStorage loadTasks error:', e);
      throw new Error('Failed to load tasks from local storage.');
    }
  },
};
