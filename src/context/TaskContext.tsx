import React, { createContext, useReducer, ReactNode, useContext, useEffect, useState } from 'react';
import { Task, TaskState, TaskAction } from '../types/task';
import { TaskStorage } from '../services/TaskStorage';

const initialState: TaskState = {
  tasks: [],
  isLoadingTasks: true,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        isLoadingTasks: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoadingTasks: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoadingTasks: false,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        error: null,
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        error: null,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        error: null,
      };
    case 'TOGGLE_TASK_COMPLETION':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
            : task
        ),
        error: null,
      };
    default:
      return state;
  }
};

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadTasksFromStorage = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedTasks = await TaskStorage.loadTasks();
      dispatch({ type: 'SET_TASKS', payload: storedTasks });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load tasks' });
    }
  };

  // Load tasks from storage on startup
  useEffect(() => {
    const init = async () => {
      await loadTasksFromStorage();
      setIsInitialized(true);
    };
    init();
  }, []);

  // Save tasks to storage automatically whenever they change
  useEffect(() => {
    const saveTasksToStorage = async () => {
      if (isInitialized) {
        try {
          await TaskStorage.saveTasks(state.tasks);
        } catch (err: any) {
          dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to save tasks' });
        }
      }
    };
    saveTasksToStorage();
  }, [state.tasks, isInitialized]);

  const refreshTasks = async () => {
    await loadTasksFromStorage();
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskCompletion = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: id });
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
