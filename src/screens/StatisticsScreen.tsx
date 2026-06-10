import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { useTask } from '../context/TaskContext';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';

const ClipboardIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
  </Svg>
);

const CheckCircleIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

const ClockIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const AlertCircleIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

export const StatisticsScreen = () => {
  const { tasks } = useTask();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => t.priority === 'High' && t.status === 'Pending').length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, highPriority, completionRate };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState 
          title="No Data Available" 
          message="Create some tasks to view your productivity statistics!" 
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Overview</Text>
        <Text style={styles.headerSubtitle}>Track your productivity</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Completion Rate</Text>
          <Text style={styles.progressPercentage}>{stats.completionRate}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${stats.completionRate}%` }]} />
        </View>
      </View>

      <StatCard 
        title="Total Tasks" 
        value={stats.total} 
        icon={<ClipboardIcon color="#3b82f6" />} 
        color="#3b82f6" 
      />
      <StatCard 
        title="Completed Tasks" 
        value={stats.completed} 
        icon={<CheckCircleIcon color="#10b981" />} 
        color="#10b981" 
      />
      <StatCard 
        title="Pending Tasks" 
        value={stats.pending} 
        icon={<ClockIcon color="#f59e0b" />} 
        color="#f59e0b" 
      />
      <StatCard 
        title="Pending High Priority" 
        value={stats.highPriority} 
        icon={<AlertCircleIcon color="#ef4444" />} 
        color="#ef4444" 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 5,
  },
});
