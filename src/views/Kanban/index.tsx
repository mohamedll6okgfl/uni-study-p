import React, { useState, useMemo } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, Circle, PlayCircle, Eye, CheckCircle2, Search } from 'lucide-react';
import { usePlannerData, usePlannerUI } from '../../context/PlannerContext';
import type { Status, Priority } from '../../types';
import KanbanColumn from './KanbanColumn';
import AssignmentForm from '../../components/forms/AssignmentForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useFilteredAssignments from '../../hooks/useFilteredAssignments';

export const Kanban: React.FC = () => {
  const { data, dispatch } = usePlannerData();
  const { ui, dispatch: uiDispatch } = usePlannerUI();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Configure DnD Sensors for better touch and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activation to allow clicks
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Press and hold for 250ms on mobile to drag
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get filtered assignments
  const filteredAssignments = useFilteredAssignments();

  // Columns definition
  const columns = [
    { id: 'todo',        label: 'To Do',       icon: <Circle className="w-4 h-4" /> },
    { id: 'in_progress', label: 'In Progress', icon: <PlayCircle className="w-4 h-4 text-brand-500" /> },
    { id: 'review',      label: 'Review',      icon: <Eye className="w-4 h-4 text-amber-500" /> },
    { id: 'done',        label: 'Done',        icon: <CheckCircle2 className="w-4 h-4 text-success-500" /> },
  ];

  // Bucket assignments into columns
  const columnAssignments = useMemo(() => {
    const buckets: Record<Status, typeof filteredAssignments> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };

    filteredAssignments.forEach((a) => {
      if (buckets[a.status]) {
        buckets[a.status].push(a);
      }
    });

    return buckets;
  }, [filteredAssignments]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const assignmentId = active.id as string;
    const newStatus = over.id as Status;

    // Only update if status actually changed
    const currentStatus = data.assignments[assignmentId]?.status;
    if (currentStatus && currentStatus !== newStatus) {
      dispatch({
        type: 'MOVE_KANBAN',
        payload: { id: assignmentId, newStatus },
      });
    }
  };

  const handleAddAssignment = () => {
    setSelectedAssignmentId(null);
    setIsFormOpen(true);
  };

  const handleEditCard = (id: string) => {
    setSelectedAssignmentId(id);
    setIsFormOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    dispatch({
      type: 'DELETE_ASSIGNMENT',
      payload: { id },
    });
  };

  // Filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uiDispatch({
      type: 'SET_FILTER',
      payload: { searchQuery: e.target.value },
    });
  };

  const handleCourseFilterChange = (courseId: string) => {
    const current = ui.filterState.courseIds;
    const next = current.includes(courseId)
      ? current.filter(id => id !== courseId)
      : [...current, courseId];
    
    uiDispatch({
      type: 'SET_FILTER',
      payload: { courseIds: next },
    });
  };

  const handlePriorityFilterChange = (priority: Priority) => {
    const current = ui.filterState.priorities;
    const next = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];

    uiDispatch({
      type: 'SET_FILTER',
      payload: { priorities: next },
    });
  };

  const clearFilters = () => {
    uiDispatch({ type: 'RESET_FILTER' });
  };

  const isFiltered = ui.filterState.courseIds.length > 0 || 
                     ui.filterState.priorities.length > 0 || 
                     ui.filterState.searchQuery !== '';

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">
            Assignments
          </h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Organize your homework, papers, and projects. Drag cards between columns to update their status.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddAssignment}
        >
          New Assignment
        </Button>
      </div>

      {/* Filter Bar */}
      <Card padding="sm" className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input
            type="text"
            value={ui.filterState.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search assignments..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[--border] bg-[--bg-page] text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
          />
        </div>

        {/* Courses Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[--text-secondary] uppercase mr-1">
            Courses:
          </span>
          {Object.values(data.courses).map(c => {
            const isSelected = ui.filterState.courseIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleCourseFilterChange(c.id)}
                className={`
                  px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider border transition-all duration-150
                  ${isSelected
                    ? 'bg-brand-500 text-[#141a16] border-brand-500 shadow-sm shadow-brand-500/25'
                    : 'bg-white/5 border-[--border] text-[--text-secondary] hover:border-brand-700/40 hover:text-brand-300'
                  }
                `}
              >
                {c.code}
              </button>
            );
          })}
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[--text-secondary] uppercase mr-1">
            Priority:
          </span>
          {(['low', 'medium', 'high', 'critical'] as Priority[]).map(p => {
            const isSelected = ui.filterState.priorities.includes(p);
            return (
              <button
                key={p}
                onClick={() => handlePriorityFilterChange(p)}
                className={`
                  px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider border transition-all
                  ${isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-[--border] text-[--text-secondary] hover:bg-slate-100 dark:hover:bg-slate-850'
                  }
                `}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-bold text-brand-400 hover:text-brand-300 hover:underline shrink-0 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </Card>

      {/* Kanban Board Container */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[500px]">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              icon={col.icon}
              assignments={columnAssignments[col.id as Status]}
              courses={data.courses}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </DndContext>

      {/* Assignment Form Modal */}
      <AssignmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        assignmentId={selectedAssignmentId}
      />
    </div>
  );
};

export default Kanban;
