import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskFormScreenProps } from '../types/navigation';
import { useTask } from '../context/TaskContext';
import { Input } from '../components/Input';
import { Task } from '../types/task';

export const TaskFormScreen = ({ navigation, route }: TaskFormScreenProps) => {
  const { taskId } = route.params || {};
  const { tasks, addTask, updateTask } = useTask();
  
  const existingTask = taskId ? tasks.find(t => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(existingTask?.priority || 'Medium');
  
  const [dueDate, setDueDate] = useState<Date>(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : new Date()
  );
  
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  
  const [titleError, setTitleError] = useState('');

  const priorities: Task['priority'][] = ['Low', 'Medium', 'High'];

  const handleSave = () => {
    let isValid = true;
    
    if (title.trim() === '') {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!isValid) return;

    if (existingTask) {
      updateTask({
        ...existingTask,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate.toISOString(),
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate.toISOString(),
      });
    }

    navigation.goBack();
  };

  const handleValueChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleDismiss = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formSection}>
        <Input
          label="Task Title *"
          placeholder="e.g., Complete project proposal"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim().length > 0) setTitleError('');
          }}
          error={titleError}
        />

        <Input
          label="Description (Optional)"
          placeholder="Add details about your task"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityOption,
                priority === p && styles.priorityOptionSelected,
                priority === p && p === 'High' && { backgroundColor: '#fee2e2', borderColor: '#ef4444' },
                priority === p && p === 'Medium' && { backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
                priority === p && p === 'Low' && { backgroundColor: '#d1fae5', borderColor: '#10b981' },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text 
                style={[
                  styles.priorityText,
                  priority === p && p === 'High' && { color: '#ef4444' },
                  priority === p && p === 'Medium' && { color: '#d97706' },
                  priority === p && p === 'Low' && { color: '#059669' },
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Due Date *</Text>
        
        {Platform.OS === 'android' && (
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}

        {(showDatePicker || Platform.OS === 'ios') && (
          <View style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}>
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onValueChange={handleValueChange}
              onDismiss={handleDismiss}
              minimumDate={new Date()}
            />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {existingTask ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  formSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginTop: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f9fafb',
  },
  priorityOptionSelected: {
    borderWidth: 2,
  },
  priorityText: {
    fontWeight: '600',
    color: '#6b7280',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  iosDatePicker: {
    height: 150,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
