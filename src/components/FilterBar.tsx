import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusFilter, PriorityFilter, SortOrder } from '../hooks/useTaskFilter';

interface FilterBarProps {
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  sortOrder: SortOrder;
  hasActiveFilters: boolean;
  onStatusChange: (status: StatusFilter) => void;
  onPriorityChange: (priority: PriorityFilter) => void;
  onSortChange: (sort: SortOrder) => void;
  onReset: () => void;
}

const ChevronIcon = ({ rotated }: { rotated?: boolean }) => (
  <Svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: [{ rotate: rotated ? '180deg' : '0deg' }] }}
  >
    <Path
      d="M6 9l6 6 6-6"
      stroke="#6b7280"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const STATUS_OPTIONS: StatusFilter[] = ['All', 'Pending', 'Completed'];
const PRIORITY_OPTIONS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

const PRIORITY_COLORS: Record<PriorityFilter, string> = {
  All: '#6b7280',
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  priorityFilter,
  sortOrder,
  hasActiveFilters,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onReset,
}) => {
  const [expandedSection, setExpandedSection] = useState<
    'status' | 'priority' | 'sort' | null
  >(null);

  const toggle = (section: 'status' | 'priority' | 'sort') =>
    setExpandedSection((prev) => (prev === section ? null : section));

  return (
    <View style={styles.wrapper}>
      {/* Pill row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {/* Status pill */}
        <TouchableOpacity
          style={[styles.pill, statusFilter !== 'All' && styles.pillActive]}
          onPress={() => toggle('status')}
        >
          <Text style={[styles.pillText, statusFilter !== 'All' && styles.pillTextActive]}>
            {statusFilter === 'All' ? 'Status' : statusFilter}
          </Text>
          <ChevronIcon rotated={expandedSection === 'status'} />
        </TouchableOpacity>

        {/* Priority pill */}
        <TouchableOpacity
          style={[
            styles.pill,
            priorityFilter !== 'All' && styles.pillActive,
            priorityFilter !== 'All' && {
              borderColor: PRIORITY_COLORS[priorityFilter],
              backgroundColor: PRIORITY_COLORS[priorityFilter] + '18',
            },
          ]}
          onPress={() => toggle('priority')}
        >
          {priorityFilter !== 'All' && (
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: PRIORITY_COLORS[priorityFilter] },
              ]}
            />
          )}
          <Text
            style={[
              styles.pillText,
              priorityFilter !== 'All' && {
                color: PRIORITY_COLORS[priorityFilter],
              },
            ]}
          >
            {priorityFilter === 'All' ? 'Priority' : priorityFilter}
          </Text>
          <ChevronIcon rotated={expandedSection === 'priority'} />
        </TouchableOpacity>

        {/* Sort pill */}
        <TouchableOpacity
          style={[styles.pill, sortOrder !== 'earliest' && styles.pillActive]}
          onPress={() => toggle('sort')}
        >
          <Text style={[styles.pillText, sortOrder !== 'earliest' && styles.pillTextActive]}>
            {sortOrder === 'earliest' ? 'Due Date ↑' : 'Due Date ↓'}
          </Text>
          <ChevronIcon rotated={expandedSection === 'sort'} />
        </TouchableOpacity>

        {/* Reset button — only show when filters are active */}
        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetPill} onPress={onReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Dropdown panels */}
      {expandedSection === 'status' && (
        <View style={styles.panel}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.option, statusFilter === s && styles.optionSelected]}
              onPress={() => {
                onStatusChange(s);
                setExpandedSection(null);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  statusFilter === s && styles.optionTextSelected,
                ]}
              >
                {s}
              </Text>
              {statusFilter === s && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {expandedSection === 'priority' && (
        <View style={styles.panel}>
          {PRIORITY_OPTIONS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.option, priorityFilter === p && styles.optionSelected]}
              onPress={() => {
                onPriorityChange(p);
                setExpandedSection(null);
              }}
            >
              <View style={styles.priorityOptionRow}>
                {p !== 'All' && (
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: PRIORITY_COLORS[p] },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.optionText,
                    priorityFilter === p && styles.optionTextSelected,
                    p !== 'All' && priorityFilter === p && {
                      color: PRIORITY_COLORS[p],
                    },
                  ]}
                >
                  {p}
                </Text>
              </View>
              {priorityFilter === p && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {expandedSection === 'sort' && (
        <View style={styles.panel}>
          {(
            [
              { value: 'earliest', label: 'Earliest first ↑' },
              { value: 'latest', label: 'Latest first ↓' },
            ] as const
          ).map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[styles.option, sortOrder === value && styles.optionSelected]}
              onPress={() => {
                onSortChange(value);
                setExpandedSection(null);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === value && styles.optionTextSelected,
                ]}
              >
                {label}
              </Text>
              {sortOrder === value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f3f4f6',
  },
  pillsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  pillActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
    marginRight: 2,
  },
  pillTextActive: {
    color: '#2563eb',
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  panel: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionSelected: {
    backgroundColor: '#f0f7ff',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '700',
  },
});
