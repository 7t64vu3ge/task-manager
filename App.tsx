import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
