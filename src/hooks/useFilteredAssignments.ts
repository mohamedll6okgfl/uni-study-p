import { useMemo } from 'react';
import { usePlannerData, usePlannerUI } from '../context/PlannerContext';
import type { Assignment } from '../types';

const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Custom hook to filter and sort assignments based on the global UI filter state.
 */
export function useFilteredAssignments(): Assignment[] {
  const { data } = usePlannerData();
  const { ui } = usePlannerUI();
  const { filterState } = ui;

  return useMemo(() => {
    let list = Object.values(data.assignments);

    // 1. Filter by Course
    if (filterState.courseIds.length > 0) {
      list = list.filter(a => filterState.courseIds.includes(a.courseId));
    }

    // 2. Filter by Priority
    if (filterState.priorities.length > 0) {
      list = list.filter(a => filterState.priorities.includes(a.priority));
    }

    // 3. Filter by Status
    if (filterState.statuses.length > 0) {
      list = list.filter(a => filterState.statuses.includes(a.status));
    }

    // 4. Filter by Date Range
    if (filterState.dateRange.from) {
      const fromTime = new Date(filterState.dateRange.from).getTime();
      list = list.filter(a => new Date(a.dueDate).getTime() >= fromTime);
    }
    if (filterState.dateRange.to) {
      const toTime = new Date(filterState.dateRange.to).getTime();
      list = list.filter(a => new Date(a.dueDate).getTime() <= toTime);
    }

    // 5. Filter by Search Query (title, description, tags)
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // 6. Sort
    list.sort((a, b) => {
      let compare = 0;

      if (filterState.sortBy === 'dueDate') {
        // Handle dates: empty/past/future
        compare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (filterState.sortBy === 'priority') {
        compare = (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
      } else if (filterState.sortBy === 'course') {
        const courseA = data.courses[a.courseId]?.name || '';
        const courseB = data.courses[b.courseId]?.name || '';
        compare = courseA.localeCompare(courseB);
      } else if (filterState.sortBy === 'createdAt') {
        compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return filterState.sortDir === 'asc' ? compare : -compare;
    });

    return list;
  }, [data.assignments, data.courses, filterState]);
}

export default useFilteredAssignments;
