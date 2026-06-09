import { useState, useMemo } from 'react';
import { Task } from '../types/task';

export type StatusFilter = 'All' | 'Pending' | 'Completed';
export type PriorityFilter = 'All' | 'High' | 'Medium' | 'Low';
export type SortOrder = 'earliest' | 'latest';

export interface FilterState {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  sortOrder: SortOrder;
}

export const useTaskFilter = (tasks: Task[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('earliest');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Search by title (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    // 2. Filter by status
    if (statusFilter !== 'All') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // 3. Filter by priority
    if (priorityFilter !== 'All') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // 4. Sort by due date
    result.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'earliest' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortOrder]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortOrder('earliest');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortOrder !== 'earliest';

  return {
    // State
    searchQuery,
    statusFilter,
    priorityFilter,
    sortOrder,
    // Derived
    filteredTasks,
    hasActiveFilters,
    // Setters
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setSortOrder,
    resetFilters,
  };
};
