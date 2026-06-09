import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { Task } from '../types/task';

const TrashIcon = ({ color = '#4b5563', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30">
    <Path fill={color} d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"/>
  </Svg>
);

const EditIcon = ({ color = '#4b5563', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G>
      <Path fill="none" d="M0 0h24v24H0z"/>
      <Path fill={color} d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/>
    </G>
  </Svg>
);

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ task, onEdit, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  const getPriorityColor = () => {
    if (isCompleted) return '#9ca3af'; // Grey out if completed
    switch (task.priority) {
      case 'High': return '#ef4444'; // Red
      case 'Medium': return '#f59e0b'; // Amber
      case 'Low': return '#10b981'; // Green
      default: return '#6b7280';
    }
  };

  const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete }
      ]
    );
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={onToggleStatus}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
        >
          <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isCompleted && styles.completedText]} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
            <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextPending]}>
              {task.status}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} hitSlop={{top: 10, bottom: 10, left: 5, right: 5}} style={styles.actionBtn}>
              <EditIcon color={isCompleted ? '#9ca3af' : '#4b5563'} size={18} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} hitSlop={{top: 10, bottom: 10, left: 5, right: 10}} style={styles.actionBtn}>
              <TrashIcon color={isCompleted ? '#9ca3af' : '#ef4444'} size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {task.description ? (
        <Text style={[styles.description, isCompleted && styles.completedTextDimmed]} numberOfLines={3}>
          {task.description}
        </Text>
      ) : null}
      
      <View style={styles.footer}>
        <View style={styles.priorityContainer}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
          <Text style={[styles.priorityText, isCompleted && styles.completedTextDimmed]}>
            {task.priority}
          </Text>
        </View>
        <Text style={[styles.dateText, isCompleted && styles.completedTextDimmed]}>
          Due: {formattedDate}
        </Text>
      </View>
    </View>
  );
};

// Use React.memo with a custom equality check to prevent unnecessary re-renders in FlatList
export const TaskCard = memo(TaskCardComponent, (prevProps, nextProps) => {
  return prevProps.task === nextProps.task;
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#f9fafb',
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  completedTextDimmed: {
    color: '#9ca3af',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#fef3c7',
  },
  badgeCompleted: {
    backgroundColor: '#d1fae5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextPending: {
    color: '#d97706',
  },
  badgeTextCompleted: {
    color: '#059669',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 12,
    padding: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
    marginLeft: 36, // Align with title text (24px checkbox + 12px margin)
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginLeft: 36, // Align with title text
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
});
