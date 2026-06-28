import {
  LayoutDashboard,
  Columns,
  CalendarCheck,
  Calendar,
  BookOpen,
  StickyNote
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  view: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/',           label: 'Dashboard',   icon: LayoutDashboard, view: 'Dashboard' },
  { path: '/kanban',     label: 'Assignments', icon: Columns,         view: 'Kanban' },
  { path: '/exams',      label: 'Exams',       icon: CalendarCheck,   view: 'ExamScheduler' },
  { path: '/calendar',   label: 'Calendar',    icon: Calendar,        view: 'Calendar' },
  { path: '/courses',    label: 'Courses',     icon: BookOpen,        view: 'Courses' },
  { path: '/scratchpad', label: 'Notes',       icon: StickyNote,      view: 'Scratchpad' },
];
export default NAV_ITEMS;
