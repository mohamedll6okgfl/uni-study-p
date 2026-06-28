export type Priority  = 'low' | 'medium' | 'high' | 'critical';
export type Status    = 'todo' | 'in_progress' | 'review' | 'done';
export type NoteColor = 'default' | 'yellow' | 'blue' | 'green' | 'red';

// ── Course ──────────────────────────────────
export interface Course {
  id:          string;          // uuid
  name:        string;          // "Calculus II"
  code:        string;          // "MATH-201"
  color:       string;          // Tailwind color name: "indigo" | "rose" | "teal" | ...
  instructor:  string;
  credits:     number;
  semester:    string;          // "Fall 2025"
  schedule: {
    days:      ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[];
    startTime: string;          // "09:00"
    endTime:   string;          // "10:15"
    location:  string;
  };
  createdAt:   string;          // ISO 8601
  isArchived:  boolean;
}

// ── Supporting sub-types ──────────────────────
export interface Attachment {
  id:   string;
  name: string;
  url:  string;
  type: 'link' | 'file';
}

export interface StudySession {
  id:            string;
  assignmentId:  string;
  startTime:     string;        // ISO 8601
  endTime:       string | null; // null if active
  durationMins:  number;
  pomodoroCount: number;
  notes:         string;
}

// ── Assignment ───────────────────────────────
export interface Assignment {
  id:            string;
  courseId:      string;        // FK → Course.id
  title:         string;
  description:   string;
  dueDate:       string;        // ISO 8601
  dueTime:       string;        // "23:59"
  priority:      Priority;
  status:        Status;
  estimatedHrs:  number;
  actualHrs:     number;
  tags:          string[];      // ["essay", "group-work"]
  attachments:   Attachment[];
  studySessions: StudySession[];
  createdAt:     string;
  updatedAt:     string;
}

// ── Exam ─────────────────────────────────────
export interface Exam {
  id:        string;
  courseId:  string;            // FK → Course.id
  title:     string;            // "Midterm Exam"
  type:      'midterm' | 'final' | 'quiz' | 'lab' | 'presentation';
  date:      string;            // ISO 8601
  startTime: string;
  endTime:   string;
  location:  string;
  weight:    number;            // % of final grade, e.g. 30
  topics:    string[];          // ["Integration by parts", "Series"]
  notes:     string;            // freeform prep notes
  createdAt: string;
}

// ── Note ─────────────────────────────────────
export interface Note {
  id:             string;
  courseId:       string | null;   // nullable = global note
  linkedItemId:   string | null;   // FK → Assignment.id or Exam.id
  linkedItemType: 'assignment' | 'exam' | null;
  title:          string;
  content:        string;          // markdown string
  color:          NoteColor;
  isPinned:       boolean;
  tags:           string[];
  createdAt:      string;
  updatedAt:      string;
}

// ── Root state shape ──────────────────────────
export interface PlannerState {
  courses:     Record<string, Course>;      // normalized maps
  assignments: Record<string, Assignment>;
  exams:       Record<string, Exam>;
  notes:       Record<string, Note>;
  // Ordered ID arrays preserve sort order without re-sorting the maps
  courseIds:     string[];
  assignmentIds: string[];
  examIds:       string[];
  noteIds:       string[];
}

// ── UI state (separate from data) ────────────
export interface UIState {
  theme:            'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeView:       string;
  activeCourseId:   string | null;
  pomodoroState: {
    isActive:          boolean;
    isPaused:          boolean;
    assignmentId:      string | null;
    phase:             'work' | 'short_break' | 'long_break';
    secondsLeft:       number;
    sessionsCompleted: number;
  };
  filterState: FilterState;
}

export interface FilterState {
  courseIds:   string[];
  priorities:  Priority[];
  statuses:    Status[];
  dateRange:   { from: string | null; to: string | null };
  searchQuery: string;
  sortBy:      'dueDate' | 'priority' | 'course' | 'createdAt';
  sortDir:     'asc' | 'desc';
}
