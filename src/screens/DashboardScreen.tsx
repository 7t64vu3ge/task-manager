import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { DashboardScreenProps } from '../types/navigation';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { Task } from '../types/task';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { useTaskFilter } from '../hooks/useTaskFilter';

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { tasks, toggleTaskCompletion, deleteTask, isLoadingTasks } = useTask();
  const { logout } = useAuth();
  
  // Apply our custom filtering hook
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    sortOrder,
    filteredTasks,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setSortOrder,
    resetFilters,
  } = useTaskFilter(tasks);



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

  if (isLoadingTasks) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder="Search tasks by title..." 
        />
      </View>
      
      <FilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortOrder={sortOrder}
        hasActiveFilters={hasActiveFilters}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />

      <FlatList
        data={filteredTasks}
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
            title={hasActiveFilters ? "No matching tasks" : "No tasks yet"} 
            message={
              hasActiveFilters 
                ? "Try adjusting your filters or search query." 
                : "Tap the + button below to create your first task and get organized!"
            } 
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
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

});
