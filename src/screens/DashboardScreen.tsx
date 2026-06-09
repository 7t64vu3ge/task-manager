import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { DashboardScreenProps } from '../types/navigation';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { Task } from '../types/task';

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { tasks, toggleTaskCompletion, deleteTask } = useTask();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for smooth UI transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Place the logout button in the top right header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  // Use useCallback to prevent unnecessary re-renders of list items
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <TaskCard 
      task={item} 
      onToggleStatus={() => toggleTaskCompletion(item.id)}
      onDelete={() => deleteTask(item.id)}
      onEdit={() => navigation.navigate('TaskForm', { taskId: item.id })}
    />
  ), [toggleTaskCompletion, deleteTask, navigation]);

  // Stable key extractor
  const keyExtractor = useCallback((item: Task) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderTask}
        // FlatList Performance Optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <EmptyState 
            title="No tasks yet" 
            message="Tap the + button below to create your first task and get organized!" 
          />
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding so FAB doesn't cover last item
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb', // Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '300',
    marginTop: -2,
  },
  logoutButton: {
    paddingRight: 16,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
