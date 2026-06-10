import { useState, useMemo } from 'react';
import { Task } from '../types/task';
import { semanticFilter } from '../utils/semanticSearch';

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

    if (searchQuery.trim()) {
      result = semanticFilter(result, searchQuery.trim());
    }

    if (statusFilter !== 'All') {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

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
  };
};
