# 🏗️ University Planner Dashboard — Architectural Blueprint

> **Stack**: React 19 · Tailwind CSS · Lucide React  
> **Goal**: Outperform Notion, Todoist, and Shovel App in a single unified workspace

---

## 🎯 1. COMPETITIVE ARCHITECTURE & SPECIFICATIONS

### 1.1 Competitive Fusion Strategy

The goal is to identify the *exact mechanism* of each competitor's strength and surgically transplant it — not imitate the surface aesthetic.

**Notion's Kanban** power comes from its relational data model: tasks aren't just list items, they carry properties that can be filtered, grouped, and visualized in multiple views simultaneously. We replicate this by designing assignments as first-class data objects with a `status` field that drives the Kanban view, a `dueDate` that drives the calendar, and a `courseId` FK that drives analytics — one data object, three views, zero duplication.

**Todoist's filtering** wins because of its natural-language query layer and its "today/upcoming" perspectives that collapse complex data into actionable lists. We replicate this with a `useFilteredAssignments` hook that accepts a `FilterState` object (course, priority, status, date range) and returns a memoized, sorted result — effectively giving users named "perspectives" (Today, This Week, High Priority) as saved filter presets.

**Shovel App's countdown timers** create urgency through persistent visual pressure. The distinction from a simple date display is real-time resolution (seconds ticking) and contextual color-coding (green → amber → red as the deadline approaches). We replicate this with a `useCountdown` hook that returns `{ days, hours, minutes, seconds, urgency: 'safe' | 'warning' | 'critical' }`, where `urgency` drives a Tailwind class swap on the badge.

**Our differentiator**: None of the three combine all three features into a unified session-aware workspace. We add a `usePomodoro` timer that is contextually bound to a specific assignment — when you start a Pomodoro on an assignment, the dashboard subtly highlights that card and the session log is attached to that task's `studySessions[]` array. This is a feature none of the three competitors offer.

---

### 1.2 Mobile-First Responsive Layout Strategy

The layout uses a **three-breakpoint system** driven by Tailwind's `sm` / `md` / `lg` prefixes, with a clear component-swap pattern between mobile and desktop:

```
MOBILE  (<768px)
┌─────────────────────────────────┐
│         TopBar (Logo + Clock)   │
├─────────────────────────────────┤
│                                 │
│         <Outlet /> (View)       │
│                                 │
│                                 │
├─────────────────────────────────┤
│  🏠   📋   📅   📝   ⏱️        │  ← BottomNav (fixed)
└─────────────────────────────────┘

TABLET  (768px – 1279px)
┌────────┬────────────────────────┐
│        │                        │
│  Icon  │   <Outlet /> (View)    │
│  Rail  │                        │
│ (64px) │                        │
└────────┴────────────────────────┘

DESKTOP (≥1280px)
┌──────────────┬──────────────────────────────────┐
│              │                                  │
│  Full        │   <Outlet /> (View)              │
│  Sidebar     │                                  │
│  (240px)     │   optional Right Panel           │
│              │   (340px, collapsible)           │
└──────────────┴──────────────────────────────────┘
```

**Implementation pattern**: A single `<AppShell>` component renders conditionally. The sidebar nav items are shared data — a `NAV_ITEMS` constant — consumed by both `<SidebarNav>` and `<BottomNav>`. The active view `<Outlet>` fills the remaining space in all three layouts via a `flex-1 overflow-y-auto` container, ensuring scrolling is always scoped to the content pane, never the page.

---

### 1.3 Design Token System — Slate & Indigo Palette with System-Aware Dark Mode

The design token strategy uses CSS custom properties defined at `:root` and overridden under a `[data-theme="dark"]` attribute on `<html>`. The React context manages the theme toggle, persists to `localStorage`, and respects `prefers-color-scheme` on first load via `matchMedia`.

#### Core Palette Definition (`tailwind.config.js`)

```javascript
theme: {
  extend: {
    colors: {
      // Brand ramp — Indigo
      brand: {
        50:  '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        400: '#818cf8',
        500: '#6366f1',   // PRIMARY ACTION
        600: '#4f46e5',
        700: '#4338ca',
        900: '#312e81',
      },
      // Surface ramp — Slate
      surface: {
        50:  '#f8fafc',   // PAGE BG (light)
        100: '#f1f5f9',   // CARD BG (light)
        200: '#e2e8f0',   // BORDER (light)
        300: '#cbd5e1',   // MUTED BORDER
        400: '#94a3b8',   // PLACEHOLDER TEXT
        500: '#64748b',   // SECONDARY TEXT
        700: '#334155',   // CARD BG (dark)
        800: '#1e293b',   // PAGE BG (dark)
        900: '#0f172a',   // DEEP BG (dark)
        950: '#020617',   // SIDEBAR BG (dark)
      },
      // Semantic colors
      success: { 100: '#dcfce7', 500: '#22c55e', 900: '#14532d' },
      warning: { 100: '#fef9c3', 500: '#eab308', 900: '#713f12' },
      danger:  { 100: '#fee2e2', 500: '#ef4444', 900: '#7f1d1d' },
      info:    { 100: '#dbeafe', 500: '#3b82f6', 900: '#1e3a8a' },
    },
    fontFamily: {
      sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    fontSize: {
      '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      xs:    ['0.75rem',  { lineHeight: '1rem' }],
      sm:    ['0.875rem', { lineHeight: '1.25rem' }],
      base:  ['1rem',     { lineHeight: '1.5rem' }],
      lg:    ['1.125rem', { lineHeight: '1.75rem' }],
      xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem',   { lineHeight: '2rem' }],
    },
    borderRadius: {
      DEFAULT: '0.5rem',
      md:  '0.5rem',
      lg:  '0.75rem',
      xl:  '1rem',
      '2xl': '1.25rem',
    },
    boxShadow: {
      card:       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
      'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
      focus:      '0 0 0 3px rgb(99 102 241 / 0.35)',
    },
    transitionDuration: {
      DEFAULT: '150ms',
    },
  }
}
```

#### Semantic CSS Variables (`globals.css`)

```css
:root {
  --bg-page:        theme('colors.surface.50');
  --bg-card:        #ffffff;
  --bg-sidebar:     theme('colors.surface.100');
  --border:         theme('colors.surface.200');
  --text-primary:   theme('colors.surface.900');
  --text-secondary: theme('colors.surface.500');
  --text-muted:     theme('colors.surface.400');
  --accent:         theme('colors.brand.500');
  --accent-hover:   theme('colors.brand.600');
  --transition:     150ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --bg-page:        theme('colors.surface.900');
  --bg-card:        theme('colors.surface.800');
  --bg-sidebar:     theme('colors.surface.950');
  --border:         theme('colors.surface.700');
  --text-primary:   theme('colors.surface.50');
  --text-secondary: theme('colors.surface.400');
  --text-muted:     theme('colors.surface.500');
  --accent:         theme('colors.brand.400');
  --accent-hover:   theme('colors.brand.500');
}
```

#### Theme Initialization (injected in `<head>` as a blocking script to prevent flash)

```html
<script>
  (function() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute(
      'data-theme',
      stored ?? (prefersDark ? 'dark' : 'light')
    );
  })();
</script>
```

---

## 🧠 2. THE CORE DATA SCHEMA & GLOBAL STATE

### 2.1 Production-Grade JSON Data Schema

The schema follows a **normalized relational model** — the same principle as a SQL database, applied to in-memory state. Foreign keys (`courseId`, `examId`) link records instead of nesting them, enabling efficient lookups and preventing update anomalies.

```typescript
// types/index.ts

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

// ── Supporting sub-types ──────────────────────
export interface StudySession {
  id:            string;
  assignmentId:  string;
  startTime:     string;        // ISO 8601
  endTime:       string | null; // null if active
  durationMins:  number;
  pomodoroCount: number;
  notes:         string;
}

export interface Attachment {
  id:   string;
  name: string;
  url:  string;
  type: 'link' | 'file';
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
```

#### Relational Mapping

```
Course (1) ──────< Assignment (many)
Course (1) ──────< Exam (many)
Course (0..1) ───< Note (many)          [nullable FK]
Assignment (1) ──< StudySession (many)
Assignment (0..1)< Note (many)          [via linkedItemId]
Exam (0..1) ─────< Note (many)          [via linkedItemId]
```

---

### 2.2 Global State Strategy — `PlannerContext`

The context is split into **two separate providers** to prevent unnecessary re-renders. A component that only reads UI state won't re-render when data changes, and vice versa.

```typescript
// context/PlannerContext.tsx

const PlannerDataContext = createContext<PlannerDataContextValue | null>(null);
const PlannerUIContext   = createContext<PlannerUIContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [data, dataDispatch] = useReducer(dataReducer, initialDataState);
  const [ui,   uiDispatch]   = useReducer(uiReducer,   initialUIState);

  // Sync data to localStorage on every data change (debounced)
  useLocalStorage('planner_data', data, dataDispatch);

  return (
    <PlannerDataContext.Provider value={{ data, dispatch: dataDispatch }}>
      <PlannerUIContext.Provider value={{ ui, dispatch: uiDispatch }}>
        {children}
      </PlannerUIContext.Provider>
    </PlannerDataContext.Provider>
  );
}

// Safe consumer hooks
export function usePlannerData() {
  const ctx = useContext(PlannerDataContext);
  if (!ctx) throw new Error('usePlannerData must be used inside PlannerProvider');
  return ctx;
}

export function usePlannerUI() {
  const ctx = useContext(PlannerUIContext);
  if (!ctx) throw new Error('usePlannerUI must be used inside PlannerProvider');
  return ctx;
}
```

#### Typed Discriminated Union — Reducer Actions

```typescript
type DataAction =
  | { type: 'ADD_COURSE';        payload: Course }
  | { type: 'UPDATE_COURSE';     payload: { id: string; changes: Partial<Course> } }
  | { type: 'DELETE_COURSE';     payload: { id: string } }
  | { type: 'ADD_ASSIGNMENT';    payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: { id: string; changes: Partial<Assignment> } }
  | { type: 'DELETE_ASSIGNMENT'; payload: { id: string } }
  | { type: 'MOVE_KANBAN';       payload: { id: string; newStatus: Status } }
  | { type: 'ADD_EXAM';          payload: Exam }
  | { type: 'UPDATE_EXAM';       payload: { id: string; changes: Partial<Exam> } }
  | { type: 'DELETE_EXAM';       payload: { id: string } }
  | { type: 'ADD_NOTE';          payload: Note }
  | { type: 'UPDATE_NOTE';       payload: { id: string; changes: Partial<Note> } }
  | { type: 'DELETE_NOTE';       payload: { id: string } }
  | { type: 'LOG_STUDY_SESSION'; payload: { assignmentId: string; session: StudySession } }
  | { type: 'HYDRATE';           payload: PlannerState };
```

---

### 2.3 Performance Optimization Map

| Location | Hook / Memo | Why it's expensive without it |
|---|---|---|
| `useFilteredAssignments` | `useMemo([data.assignments, filterState])` | Iterates all assignments, applies 4 filter predicates, sorts — O(n log n) |
| `useCourseStats` | `useMemo([data.assignments, data.exams, courseId])` | Aggregates completion %, avg grade, total hours per course |
| `useWeeklyCalendar` | `useMemo([data.assignments, data.exams, weekStart])` | Bucketing items into 7 day-columns by date comparison |
| `useKanbanColumns` | `useMemo([filteredAssignments])` | Groups array into 4 status buckets, attaches course colors |
| `useUpcomingExams` | `useMemo([data.exams, now])` | Sorts by date, calculates `daysUntil`, assigns `urgency` level |
| `dataReducer` | Stable ref via `useReducer` | `useReducer` already stabilizes dispatch — no extra memo needed |
| `handleAddCourse` | `useCallback([dispatch])` | Passed as prop to `<CourseForm>` — prevents form re-mount |
| `handleMoveKanban` | `useCallback([dispatch])` | Passed to every Kanban card — memoized once at board level |
| `handleSaveNote` | `useCallback([dispatch, note.id])` | Debounced autosave — stable reference required for debounce |

> **Critical rule**: Never call `useMemo` for values that are already cheap (primitives, object literals with 1–2 fields). The compiler overhead of memoization exceeds the cost of recomputing them.

---

## 🛠️ 3. REUSABLE COMPONENT TREE & DIRECTORY STRUCTURE

### 3.1 Project Folder Structure

```
src/
│
├── main.tsx                        # ReactDOM.createRoot, BrowserRouter
├── App.tsx                         # PlannerProvider, AppShell, Routes
│
├── types/
│   └── index.ts                    # All TypeScript interfaces
│
├── context/
│   ├── PlannerContext.tsx           # Provider, usePlannerData, usePlannerUI
│   ├── dataReducer.ts              # Pure reducer for PlannerState
│   ├── uiReducer.ts                # Pure reducer for UIState
│   └── initialState.ts             # Default state values + seed data
│
├── hooks/
│   ├── useLocalStorage.ts          # Bidirectional sync + hydration
│   ├── useCountdown.ts             # Real-time exam timer
│   ├── usePomodoro.ts              # Pomodoro FSM with completion triggers
│   ├── useFilteredAssignments.ts
│   ├── useCourseStats.ts
│   ├── useWeeklyCalendar.ts
│   ├── useKanbanColumns.ts
│   └── useDebounce.ts              # Generic debounce utility hook
│
├── utils/
│   ├── date.ts                     # formatDate, daysUntil, isOverdue, getWeekDays
│   ├── sort.ts                     # sortByPriority, sortByDate comparators
│   ├── generate.ts                 # generateId (crypto.randomUUID wrapper)
│   ├── color.ts                    # courseColorClass(colorName) → Tailwind classes
│   └── storage.ts                  # safeJSONParse, debounceWrite
│
├── components/                     # ATOMIC — reusable, context-agnostic
│   │
│   ├── ui/
│   │   ├── Button.tsx              # variant: 'primary' | 'secondary' | 'ghost' | 'danger'
│   │   ├── Badge.tsx               # variant: priority | status | course color
│   │   ├── Input.tsx               # Controlled, with label + error state
│   │   ├── Textarea.tsx            # Auto-growing textarea
│   │   ├── Select.tsx              # Styled native select
│   │   ├── Modal.tsx               # Portal-based, focus-trapped, ESC-close
│   │   ├── ConfirmDialog.tsx       # Wraps Modal for destructive actions
│   │   ├── Tooltip.tsx             # Hover tooltip via Floating UI
│   │   ├── ProgressBar.tsx         # Animated width, color via prop
│   │   ├── Spinner.tsx             # Loading indicator
│   │   ├── EmptyState.tsx          # Zero-data placeholder with CTA
│   │   └── Card.tsx                # Surface card with optional hover
│   │
│   ├── forms/
│   │   ├── CourseForm.tsx          # Add/edit course
│   │   ├── AssignmentForm.tsx      # Add/edit assignment (largest form)
│   │   ├── ExamForm.tsx            # Add/edit exam
│   │   └── NoteForm.tsx            # Add/edit note
│   │
│   ├── layout/
│   │   ├── AppShell.tsx            # Responsive layout switcher
│   │   ├── SidebarNav.tsx          # Desktop: full sidebar
│   │   ├── IconRailNav.tsx         # Tablet: icon-only rail
│   │   ├── BottomNav.tsx           # Mobile: bottom tab bar
│   │   └── TopBar.tsx              # Mobile: top header
│   │
│   └── shared/
│       ├── CourseColorDot.tsx      # Small colored indicator
│       ├── PriorityIcon.tsx        # Lucide icon mapped from Priority
│       ├── CountdownBadge.tsx      # Live countdown using useCountdown
│       ├── PomodoroWidget.tsx      # Floating mini-timer using usePomodoro
│       └── ThemeToggle.tsx         # Sun/Moon icon button
│
└── views/                          # VIEW-LEVEL — consume context, compose atoms
    ├── Dashboard/
    │   ├── index.tsx               # Route component
    │   ├── StatsGrid.tsx           # 4 metric cards (assignments, exams, GPA, hours)
    │   ├── UpcomingList.tsx        # Sorted upcoming items
    │   ├── WeeklyProgressBar.tsx
    │   └── ActivePomodoro.tsx      # If session active, shows mini card
    │
    ├── Kanban/
    │   ├── index.tsx
    │   ├── KanbanColumn.tsx        # Single status column
    │   ├── KanbanCard.tsx          # Draggable assignment card
    │   └── KanbanFilters.tsx       # Filter bar above board
    │
    ├── ExamScheduler/
    │   ├── index.tsx
    │   ├── ExamCard.tsx            # With live CountdownBadge
    │   └── ExamTimeline.tsx        # Visual timeline sorted by date
    │
    ├── Calendar/
    │   ├── index.tsx
    │   ├── WeekView.tsx            # 7-column week grid
    │   └── CalendarEventPill.tsx
    │
    ├── Courses/
    │   ├── index.tsx
    │   ├── CourseCard.tsx
    │   └── CourseDetailPanel.tsx   # Slide-in with stats + linked items
    │
    └── Scratchpad/
        ├── index.tsx
        ├── NoteGrid.tsx            # Masonry-style note layout
        ├── NoteCard.tsx            # Color-coded, expandable
        └── NoteEditor.tsx          # Markdown editor with preview toggle
```

---

### 3.2 Atomic vs View-Level Classification

**Atomic components** receive all their data as props and dispatch no context actions directly. They are purely presentational and event-emitting — testable in isolation with zero mocking.

| Atomic Component | Description |
|---|---|
| `Button` | 4 variants, loading state, icon slot (left/right) |
| `Badge` | Maps `Priority` and `Status` enums to colored pills |
| `Modal` | Portal, `aria-modal`, focus trap, `onClose` prop |
| `Card` | Surface wrapper with `hover`, `active`, `selected` states |
| `ProgressBar` | Width from `value/max`, color from prop |
| `CountdownBadge` | Calls `useCountdown(targetDate)`, renders result |
| `EmptyState` | Icon + title + description + optional CTA button |

**View-level components** may call `usePlannerData()` / `usePlannerUI()` directly and dispatch actions. They compose atoms and own the interaction logic for their domain.

| View Component | Key Interactions |
|---|---|
| `Dashboard` | Read-only aggregate view; navigates to detail views on click |
| `KanbanBoard` | Drag-and-drop dispatches `MOVE_KANBAN`; opens `AssignmentForm` modal |
| `ExamScheduler` | Adds/edits/deletes exams; each card has live countdown |
| `Calendar` | Read + navigate week; click opens assignment/exam detail |
| `Scratchpad` | CRUD notes; Markdown preview toggle; pin/color controls |
| `CourseDetail` | Shows all assignments + exams for one course; opens forms inline |

---

## ⏳ 4. REACTIONARY HOOKS & BUSINESS LOGIC

### 4.1 `useLocalStorage` — Safe Bidirectional Sync

**Problem it solves**: The reducer is in-memory only. On page reload, all state is lost. We need to (a) hydrate state from `localStorage` on mount and (b) persist state to `localStorage` on every change — without causing infinite loops or blocking the main thread.

#### Logic Flow

```
MOUNT:
  1. Try safeJSONParse(localStorage.getItem(key))
  2. If parse succeeds → dispatch({ type: 'HYDRATE', payload: parsed })
  3. If parse fails (corrupt) → stay on initialState, log warning

ON STATE CHANGE:
  1. Receive new state via useEffect([state])
  2. Pass to debounceWrite(key, JSON.stringify(state), 300ms)
     — 300ms debounce prevents writes on every single keystroke
     — Uses a ref to hold the setTimeout id (no closure leak)
  3. On unmount, clearTimeout(timeoutRef.current)

CROSS-TAB SYNC:
  1. addEventListener('storage', handler) on mount
  2. If event.key === key && event.storageArea === localStorage
     → dispatch({ type: 'HYDRATE', payload: safeJSONParse(event.newValue) })
  3. removeEventListener on unmount
```

#### Signature

```typescript
function useLocalStorage<T>(
  key: string,
  state: T,
  dispatch: React.Dispatch<{ type: 'HYDRATE'; payload: T }>
): void
```

This hook has no return value — it is a side-effect-only hook, a "sync" that runs silently. This design prevents it from being misused as a data source (the reducer is the source of truth).

---

### 4.2 `useCountdown` — Leak-Free Dynamic Timer

**Problem it solves**: A naive `setInterval` inside a component leaks if the component unmounts before the interval fires. It also produces stale closure values if dependencies are not carefully managed. We need a hook that is declarative (pass in a date, get back remaining time) and automatically cleans itself up.

#### Logic Flow

```
INPUT: targetDate (ISO string)

ON MOUNT / targetDate CHANGE:
  1. Calculate initial delta: targetMs - Date.now()
  2. If delta <= 0 → return { expired: true } immediately, no interval
  3. Store intervalId in ref (not state — changing it should not trigger re-render)
  4. setInterval(tick, 1000):
       tick():
         delta = targetMs - Date.now()
         if delta <= 0:
           clearInterval(intervalId.current)
           setState({ days:0, hours:0, minutes:0, seconds:0, expired:true, urgency:'critical' })
           return
         setState(decompose(delta))
  5. On cleanup (unmount OR targetDate change):
       clearInterval(intervalId.current)   ← THE CRITICAL LEAK PREVENTION

DECOMPOSE(deltaMs):
  days    = Math.floor(deltaMs / 86_400_000)
  hours   = Math.floor((deltaMs % 86_400_000) / 3_600_000)
  minutes = Math.floor((deltaMs % 3_600_000) / 60_000)
  seconds = Math.floor((deltaMs % 60_000) / 1_000)
  urgency = days >= 3 ? 'safe' : days >= 1 ? 'warning' : 'critical'
```

#### Signature

```typescript
type Urgency = 'safe' | 'warning' | 'critical';

interface CountdownResult {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
  urgency: Urgency;
  expired: boolean;
}

function useCountdown(targetDate: string): CountdownResult
```

#### Usage in `ExamCard`

```tsx
const { days, hours, urgency, expired } = useCountdown(exam.date + 'T' + exam.startTime);

const urgencyClass = {
  safe:     'bg-success-100 text-success-900',
  warning:  'bg-warning-100 text-warning-900',
  critical: 'bg-danger-100  text-danger-900  animate-pulse',
}[urgency];
```

---

### 4.3 `usePomodoro` — Background Timer with Completion Triggers

**Problem it solves**: A Pomodoro timer must (a) survive navigation between views (it lives in global UI context, not a component), (b) fire a callback when each phase completes, and (c) expose enough state for both the floating widget and the sidebar indicator to render correctly without both running separate timers.

#### State Machine

```
States: IDLE → WORKING → SHORT_BREAK → WORKING → ... → LONG_BREAK → IDLE
        (after 4 WORK sessions, break becomes LONG_BREAK)

Transitions: start() | pause() | resume() | skip() | stop()

DURATIONS (configurable via settings):
  WORK:        25 × 60 = 1500s
  SHORT_BREAK:  5 × 60 =  300s
  LONG_BREAK:  15 × 60 =  900s
```

#### Logic Flow

```
STATE: { phase, secondsLeft, sessionsCompleted, isActive, assignmentId, isPaused }

start(assignmentId):
  1. Dispatch UI action: SET_POMODORO_ACTIVE { assignmentId, phase:'work', secondsLeft:1500 }
  2. This triggers the useEffect that creates the interval

INTERVAL TICK (every 1000ms, only when isActive && !isPaused):
  1. secondsLeft -= 1
  2. If secondsLeft === 0 → handle phase completion (see below)

PHASE COMPLETION:
  if phase === 'work':
    sessionsCompleted += 1
    next phase = sessionsCompleted % 4 === 0 ? 'long_break' : 'short_break'
    onWorkComplete(assignmentId)  // callback → dispatch LOG_STUDY_SESSION
    showNotification('Work session complete! Time to rest.')
  else:
    next phase = 'work'
    showNotification('Break over. Ready to focus?')
  reset secondsLeft to next phase duration

CLEANUP:
  clearInterval on: unmount | stop() | phase change
  The interval ref lives in a useRef — never recreated unless dependencies change
```

#### Signature

```typescript
interface PomodoroControls {
  start:  (assignmentId: string) => void;
  pause:  () => void;
  resume: () => void;
  skip:   () => void;
  stop:   () => void;
}

interface PomodoroState {
  isActive:          boolean;
  isPaused:          boolean;
  phase:             'work' | 'short_break' | 'long_break';
  secondsLeft:       number;
  sessionsCompleted: number;
  assignmentId:      string | null;
  progressPercent:   number;  // (totalSeconds - secondsLeft) / totalSeconds * 100
}

function usePomodoro(): PomodoroState & PomodoroControls
```

> **Key design decision**: The timer state lives in `UIState` (inside the context), so `secondsLeft` decrements are dispatched via `uiDispatch`. The interval is owned by a single `useEffect` inside `usePomodoro`, not scattered across components — and the floating `PomodoroWidget` reads from context rather than computing its own timer.

---

## 🚀 5. PHASED SPRINT MILESTONES

### Phase 1 — Foundation: State, Types & Storage *(~2 days)*

**Deliverables**:
- `src/types/index.ts` — Complete TypeScript interface definitions
- `src/context/` — `PlannerProvider`, `dataReducer`, `uiReducer`, `initialState` with seed data (3 courses, 5 assignments, 2 exams, 3 notes)
- `src/hooks/useLocalStorage.ts` — Hydration + debounced persistence + cross-tab sync
- `src/utils/` — `date.ts`, `generate.ts`, `storage.ts`
- `src/hooks/useCountdown.ts` and `src/hooks/usePomodoro.ts`

**Acceptance Criteria before Phase 2**:

- [ ] Open DevTools → Application → Local Storage: after adding a course via direct dispatch in a test component, the JSON appears within 400ms, correctly structured
- [ ] Reload the page: the course persists and the `HYDRATE` action fires exactly once (verified via React DevTools)
- [ ] Open a second browser tab: make a change in Tab 1, Tab 2 receives the update within 1 second (`storage` event cross-tab sync working)
- [ ] `useCountdown('2025-12-31T23:59:59')` renders `{ days: N, hours: N, ... }` and the seconds decrement every 1000ms without console errors
- [ ] `usePomodoro()` cycles correctly: `start → 1500s countdown → short_break → 300s → work` — confirmed with fast-forward test (set `WORK = 3s` in test mode)
- [ ] TypeScript compiles with `strict: true` and zero errors

---

### Phase 2 — Shell: Layout, Navigation & Theme *(~2 days)*

**Deliverables**:
- `tailwind.config.js` — Full token extension
- `src/globals.css` — CSS custom properties + blocking theme script
- `src/components/layout/` — `AppShell`, `SidebarNav`, `IconRailNav`, `BottomNav`, `TopBar`
- `src/components/ui/` — `Button`, `Badge`, `Card`, `Modal`, `Spinner`, `EmptyState`
- `src/components/shared/ThemeToggle.tsx`
- Route stubs for all 5 views (`<h1>` placeholders)

**Acceptance Criteria before Phase 3**:

- [ ] At 375px (iPhone SE): BottomNav visible + fixed, SidebarNav hidden — confirmed via DevTools responsive mode
- [ ] At 768px (iPad): IconRailNav visible, BottomNav hidden, SidebarNav hidden
- [ ] At 1280px (Desktop): Full SidebarNav visible, others hidden
- [ ] ThemeToggle: clicking it toggles `data-theme` on `<html>`, transitions smoothly in 150ms (no flash)
- [ ] On hard refresh in dark mode: dark theme applies before first paint (blocking script works)
- [ ] All 4 `Button` variants render correctly in both light and dark mode — no hardcoded colors visible
- [ ] `Modal` opens with focus trapped, closes on ESC, focus returns to trigger element after close (accessibility audit passes)

---

### Phase 3 — Dashboard & Analytics *(~3 days)*

**Deliverables**:
- `src/hooks/useFilteredAssignments.ts`
- `src/hooks/useCourseStats.ts`
- `src/views/Dashboard/` — All subcomponents
- `src/components/forms/AssignmentForm.tsx` and `CourseForm.tsx`
- `src/views/Courses/` — `index.tsx`, `CourseCard.tsx`, `CourseDetailPanel.tsx`
- `src/components/shared/CountdownBadge.tsx`

**Acceptance Criteria before Phase 4**:

- [ ] Dashboard renders correctly with seed data: correct assignment count, correct upcoming exam count
- [ ] With 100 fake assignments in state, `useFilteredAssignments` with a filter applied completes in < 5ms (measured with `performance.now()` wrapper in dev)
- [ ] `useMemo` verified: `console.log('recomputing')` inside the memo only fires when `filterState` or `assignments` actually changes — not on unrelated updates like theme toggle
- [ ] `AssignmentForm` modal: all fields validate correctly (empty title blocked, past due date shows warning), submitting dispatches `ADD_ASSIGNMENT` and new card appears without reload
- [ ] `CourseDetailPanel`: clicking a course shows only that course's assignments and exams — filtered correctly via `courseId`

---

### Phase 4 — Kanban, Exam Scheduler & Calendar *(~3 days)*

**Deliverables**:
- `src/hooks/useKanbanColumns.ts`
- `src/hooks/useWeeklyCalendar.ts`
- `src/views/Kanban/` — Full board with drag-and-drop (`@dnd-kit/core`)
- `src/views/ExamScheduler/` — Full scheduler with live countdowns
- `src/views/Calendar/` — Week view with event pills
- `src/components/forms/ExamForm.tsx`

**Acceptance Criteria before Phase 5**:

- [ ] Kanban: dragging a card from "Todo" to "In Progress" dispatches `MOVE_KANBAN` and the card appears in the new column immediately — no flicker, no duplicate
- [ ] Kanban: after drag-and-drop, reload the page — card remains in the new column (localStorage persisted)
- [ ] Drag-and-drop is keyboard accessible: `Tab` to card, `Space` to pick up, arrow keys to move between columns, `Space` to drop
- [ ] `ExamCard` countdown: test exam set 2 minutes in the future — seconds tick correctly and badge transitions from `warning` to `critical` color at the 1-day threshold
- [ ] Calendar week view: assignments due on a date appear in the correct day column; clicking navigates to previous/next week correctly; today's column is visually highlighted

---

### Phase 5 — Pomodoro, Scratchpad, Polish & PWA *(~3 days)*

**Deliverables**:
- `src/components/shared/PomodoroWidget.tsx` — Floating timer, attaches to assignment
- `src/views/Scratchpad/` — Full note CRUD with Markdown preview (`react-markdown`)
- `src/components/forms/NoteForm.tsx`
- Global search (fuzzy match across all assignments, exams, notes via `fuse.js`)
- PWA manifest + service worker (Vite PWA plugin) for offline support
- `README.md` with full setup instructions
- Accessibility audit pass (axe-core zero critical violations)
- Lighthouse score ≥ 90 across Performance, Accessibility, Best Practices

**Final Sign-Off Criteria**:

- [ ] Pomodoro: start a 25-min session on Assignment A; navigate to Kanban; navigate to Calendar; navigate back to Dashboard — timer continues without resetting (state survives navigation)
- [ ] Pomodoro: when 25 minutes expire, a browser notification fires (if permission granted) AND a `StudySession` is automatically appended to the assignment's `studySessions[]` array — visible in the assignment detail view
- [ ] Scratchpad: a note linked to an assignment (`linkedItemId` set) also appears in that assignment's detail panel as a "Linked Notes" section
- [ ] Global search: typing `"calc"` returns "Calculus II" (course), any assignment with "calculus" in title, and any exam with "calculus" in topics — results ranked by relevance
- [ ] Lighthouse accessibility: 100 score — all interactive elements have accessible names, color contrast ≥ 4.5:1, focus indicators visible
- [ ] Install as PWA on mobile Chrome: works offline, shows app icon on home screen, data persists

---

## 📦 Recommended Dependencies

| Package | Purpose |
|---|---|
| `react` `react-dom` | Core framework (v19) |
| `react-router-dom` | Client-side routing + `<Outlet>` |
| `tailwindcss` | Utility-first styling |
| `lucide-react` | Icon library |
| `@dnd-kit/core` `@dnd-kit/sortable` | Accessible drag-and-drop for Kanban |
| `react-markdown` | Markdown rendering in Scratchpad |
| `fuse.js` | Lightweight fuzzy search |
| `@floating-ui/react` | Tooltips + popovers (accessible positioning) |
| `vite-plugin-pwa` | PWA manifest + service worker generation |
| `typescript` | Type safety (strict mode) |

---

## 🧩 6. COMPONENT API CONTRACTS

This section defines the exact prop interfaces for every atomic and shared component. These contracts act as the single source of truth for both implementation and future testing. No component should be written before its interface is agreed upon here.

---

### 6.1 `Button`

```typescript
// components/ui/Button.tsx

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:    ButtonVariant;   // default: 'primary'
  size?:       ButtonSize;      // default: 'md'
  isLoading?:  boolean;         // replaces children with Spinner, disables click
  leftIcon?:   React.ReactNode; // Lucide icon element
  rightIcon?:  React.ReactNode;
  fullWidth?:  boolean;         // w-full
}
```

**Variant class map** (these are the complete Tailwind strings — never dynamic fragments):

```typescript
const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-100 dark:hover:bg-surface-600',
  ghost:     'bg-transparent text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
  danger:    'bg-danger-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-danger-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7  px-2.5 text-xs  gap-1',
  sm: 'h-8  px-3   text-sm  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-11 px-5   text-base gap-2',
};
```

**Base classes** (always applied):

```
inline-flex items-center justify-center font-medium rounded-lg
transition-colors duration-150 focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-offset-2
disabled:opacity-50 disabled:cursor-not-allowed select-none
```

---

### 6.2 `Badge`

```typescript
// components/ui/Badge.tsx

type BadgeVariant = 'priority' | 'status' | 'course' | 'neutral';
type BadgeSize    = 'sm' | 'md';

interface BadgeProps {
  variant:  BadgeVariant;
  value:    string;           // the enum value or course color name
  size?:    BadgeSize;        // default: 'sm'
  dot?:     boolean;          // show colored dot before label
  pulse?:   boolean;          // animate-pulse (for critical countdowns)
}
```

**Internal maps**:

```typescript
const priorityMap: Record<Priority, { label: string; classes: string }> = {
  low:      { label: 'Low',      classes: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300' },
  medium:   { label: 'Medium',   classes: 'bg-info-100 text-info-900 dark:bg-blue-900/40 dark:text-blue-300' },
  high:     { label: 'High',     classes: 'bg-warning-100 text-warning-900 dark:bg-yellow-900/40 dark:text-yellow-300' },
  critical: { label: 'Critical', classes: 'bg-danger-100 text-danger-900 dark:bg-red-900/40 dark:text-red-300' },
};

const statusMap: Record<Status, { label: string; classes: string }> = {
  todo:        { label: 'To Do',       classes: 'bg-surface-100 text-surface-500' },
  in_progress: { label: 'In Progress', classes: 'bg-brand-100 text-brand-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  review:      { label: 'Review',      classes: 'bg-warning-100 text-warning-900' },
  done:        { label: 'Done',        classes: 'bg-success-100 text-success-900 dark:bg-green-900/40 dark:text-green-300' },
};
```

---

### 6.3 `Modal`

```typescript
// components/ui/Modal.tsx

interface ModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  title:        string;
  description?: string;        // renders as subtitle under title
  size?:        'sm' | 'md' | 'lg' | 'xl' | 'full';  // default: 'md'
  children:     React.ReactNode;
  footer?:      React.ReactNode;  // action buttons slot
  closeOnOverlay?: boolean;       // default: true
}
```

**Implementation rules**:
- Uses `ReactDOM.createPortal` targeting `document.body`
- Applies `role="dialog"` and `aria-modal="true"` and `aria-labelledby` pointing to the title
- Uses `@floating-ui/react` `useFocusTrap()` equivalent via a custom `useFocusTrap` hook
- `useEffect` adds `overflow-hidden` to `<body>` on open, removes on close (prevents background scroll)
- Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm` with `transition-opacity duration-150`
- Panel animates in: `transition-all duration-200 ease-out` from `opacity-0 scale-95` to `opacity-100 scale-100`
- Size map:

```typescript
const sizeClasses = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw] h-[90vh]',
};
```

---

### 6.4 `Card`

```typescript
// components/ui/Card.tsx

interface CardProps {
  children:   React.ReactNode;
  className?: string;
  hover?:     boolean;          // enables hover shadow + translate-y-px
  selected?:  boolean;          // ring-2 ring-brand-500 highlight
  padding?:   'none' | 'sm' | 'md' | 'lg';  // default: 'md'
  onClick?:   () => void;
  as?:        'div' | 'article' | 'li';     // default: 'div'
}
```

**Base**: `bg-[--bg-card] border border-[--border] rounded-xl shadow-card transition-all duration-150`

**Hover**: `hover:shadow-card-hover hover:-translate-y-px cursor-pointer`

**Selected**: `ring-2 ring-brand-500 ring-offset-2 ring-offset-[--bg-page]`

---

### 6.5 `ProgressBar`

```typescript
// components/ui/ProgressBar.tsx

type ProgressColor = 'brand' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  value:      number;         // 0–100
  max?:       number;         // default: 100
  color?:     ProgressColor;  // default: 'brand'
  size?:      'xs' | 'sm' | 'md';  // height: 2px | 4px | 8px
  animated?:  boolean;        // shimmer animation while loading
  label?:     string;         // accessible aria-label
  showValue?: boolean;        // renders "73%" text to the right
}
```

**Render logic**:

```typescript
const pct = Math.min(100, Math.max(0, (value / (max ?? 100)) * 100));
// Width applied as inline style: style={{ width: `${pct}%` }}
// Tailwind transition: transition-[width] duration-500 ease-out
```

---

### 6.6 `EmptyState`

```typescript
// components/ui/EmptyState.tsx

interface EmptyStateProps {
  icon:        React.ReactNode;  // Lucide icon (sized at 40px in parent)
  title:       string;
  description: string;
  action?: {
    label:   string;
    onClick: () => void;
  };
  secondaryAction?: {
    label:   string;
    onClick: () => void;
  };
}
```

**Layout**: centered column, `py-16 px-6`, icon wrapper with `bg-surface-100 dark:bg-surface-800 rounded-2xl p-4 w-16 h-16 mx-auto mb-4`

---

### 6.7 `CountdownBadge`

```typescript
// components/shared/CountdownBadge.tsx

interface CountdownBadgeProps {
  targetDate:  string;   // ISO 8601 datetime
  label?:      string;   // overrides auto-generated text (e.g. "Exam in")
  compact?:    boolean;  // shows only "3d 4h" instead of full breakdown
  showSeconds?: boolean; // default: false (too noisy for cards)
}
```

**Render output examples**:
- `compact=false, showSeconds=true` → `"3d 14h 22m 05s"` (pulsing red if critical)
- `compact=true` → `"3d 14h"` in a colored badge pill
- `expired=true` → `"Overdue"` badge in `danger` variant with pulse

---

### 6.8 `PomodoroWidget` (Floating)

```typescript
// components/shared/PomodoroWidget.tsx
// Renders as a fixed floating card — bottom-right on desktop, bottom-center on mobile
// Visible only when pomodoroState.isActive === true

interface PomodoroWidgetProps {
  // No props — reads from usePlannerUI() and calls usePomodoro()
}
```

**Layout**:
```
┌────────────────────────────────┐
│  🍅  Calculus II – HW 3        │  ← assignment title (truncated)
│  ━━━━━━━━━━━━━━━━━━━━━  72%    │  ← ProgressBar
│  WORK SESSION   24:13   ⏸  ✕  │  ← phase label | time | pause | stop
└────────────────────────────────┘
```

The widget dispatches `uiDispatch({ type: 'SET_POMODORO_PAUSED' })` on pause and `uiDispatch({ type: 'STOP_POMODORO' })` on stop.

---

## 🔁 7. REDUCER IMPLEMENTATION GUIDE

### 7.1 `dataReducer` — Full Action Handlers

Each case in the reducer must follow **immutable update patterns** using spread syntax. The normalized shape (Record + ID array) means every insert/delete touches both the map and the ordered array.

```typescript
// context/dataReducer.ts

function dataReducer(state: PlannerState, action: DataAction): PlannerState {
  switch (action.type) {

    case 'ADD_COURSE': {
      const course = action.payload;
      return {
        ...state,
        courses:   { ...state.courses, [course.id]: course },
        courseIds: [...state.courseIds, course.id],
      };
    }

    case 'UPDATE_COURSE': {
      const { id, changes } = action.payload;
      return {
        ...state,
        courses: {
          ...state.courses,
          [id]: { ...state.courses[id], ...changes },
        },
      };
    }

    case 'DELETE_COURSE': {
      // Cascade: also delete all assignments, exams, notes linked to this course
      const { id } = action.payload;
      const orphanedAssignmentIds = state.assignmentIds.filter(
        aid => state.assignments[aid].courseId === id
      );
      const orphanedExamIds = state.examIds.filter(
        eid => state.exams[eid].courseId === id
      );
      const orphanedNoteIds = state.noteIds.filter(
        nid => state.notes[nid].courseId === id
      );

      const newCourses     = { ...state.courses };     delete newCourses[id];
      const newAssignments = { ...state.assignments };
      orphanedAssignmentIds.forEach(aid => delete newAssignments[aid]);
      const newExams = { ...state.exams };
      orphanedExamIds.forEach(eid => delete newExams[eid]);
      const newNotes = { ...state.notes };
      orphanedNoteIds.forEach(nid => delete newNotes[nid]);

      return {
        ...state,
        courses:       newCourses,
        courseIds:     state.courseIds.filter(cid => cid !== id),
        assignments:   newAssignments,
        assignmentIds: state.assignmentIds.filter(aid => !orphanedAssignmentIds.includes(aid)),
        exams:         newExams,
        examIds:       state.examIds.filter(eid => !orphanedExamIds.includes(eid)),
        notes:         newNotes,
        noteIds:       state.noteIds.filter(nid => !orphanedNoteIds.includes(nid)),
      };
    }

    case 'MOVE_KANBAN': {
      const { id, newStatus } = action.payload;
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [id]: {
            ...state.assignments[id],
            status:    newStatus,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'LOG_STUDY_SESSION': {
      const { assignmentId, session } = action.payload;
      const assignment = state.assignments[assignmentId];
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [assignmentId]: {
            ...assignment,
            studySessions: [...assignment.studySessions, session],
            actualHrs: assignment.actualHrs + (session.durationMins / 60),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'HYDRATE': {
      // Only hydrate if payload is structurally valid
      if (!action.payload?.courses || !action.payload?.assignments) return state;
      return action.payload;
    }

    default:
      return state;
  }
}
```

**Cascade delete rule**: Deleting a `Course` must also delete all child `Assignments`, `Exams`, and `Notes` that reference it. Never leave orphaned FK references in state — they will cause silent `undefined` access bugs in selectors.

---

### 7.2 `uiReducer` — UI State Transitions

```typescript
// context/uiReducer.ts

type UIAction =
  | { type: 'SET_THEME';             payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_VIEW';       payload: string }
  | { type: 'SET_ACTIVE_COURSE';     payload: string | null }
  | { type: 'SET_FILTER';            payload: Partial<FilterState> }
  | { type: 'RESET_FILTER' }
  | { type: 'START_POMODORO';        payload: { assignmentId: string } }
  | { type: 'TICK_POMODORO' }
  | { type: 'PAUSE_POMODORO' }
  | { type: 'RESUME_POMODORO' }
  | { type: 'SKIP_POMODORO_PHASE' }
  | { type: 'STOP_POMODORO' }
  | { type: 'COMPLETE_POMODORO_PHASE' };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {

    case 'SET_THEME': {
      const resolved = action.payload === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : action.payload;
      document.documentElement.setAttribute('data-theme', resolved);
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    }

    case 'SET_FILTER':
      return { ...state, filterState: { ...state.filterState, ...action.payload } };

    case 'RESET_FILTER':
      return { ...state, filterState: initialFilterState };

    case 'TICK_POMODORO': {
      const ps = state.pomodoroState;
      if (!ps.isActive || ps.secondsLeft <= 0) return state;
      return {
        ...state,
        pomodoroState: { ...ps, secondsLeft: ps.secondsLeft - 1 },
      };
    }

    case 'COMPLETE_POMODORO_PHASE': {
      const ps = state.pomodoroState;
      const newSessions = ps.phase === 'work' ? ps.sessionsCompleted + 1 : ps.sessionsCompleted;
      const nextPhase = ps.phase === 'work'
        ? (newSessions % 4 === 0 ? 'long_break' : 'short_break')
        : 'work';
      const durations = { work: 1500, short_break: 300, long_break: 900 };
      return {
        ...state,
        pomodoroState: {
          ...ps,
          phase:             nextPhase,
          secondsLeft:       durations[nextPhase],
          sessionsCompleted: newSessions,
        },
      };
    }

    case 'STOP_POMODORO':
      return {
        ...state,
        pomodoroState: {
          isActive: false, isPaused: false, assignmentId: null,
          phase: 'work', secondsLeft: 1500, sessionsCompleted: 0,
        },
      };

    // ... remaining cases follow the same immutable pattern

    default:
      return state;
  }
}
```

---

## 🎨 8. VIEW IMPLEMENTATION SPECS

### 8.1 Dashboard View — Layout & Data Flow

The Dashboard is the first screen users see. It must answer three questions at a glance: *What's due soon? How am I tracking? Am I in a study session?*

```
DESKTOP LAYOUT:
┌───────────────────────────────────────────────────────┐
│  Good morning, Alex ☀️        Week 23 of 52    [Sat]  │
├──────────┬──────────┬──────────┬─────────────────────┤
│ 📋 5     │ 📅 2     │ ⏱ 3.5h  │ 🎯 68%             │
│ Due Soon │ Exams    │ Today    │ Completion          │
├──────────┴──────────┴──────────┴─────────────────────┤
│  Upcoming (next 7 days)          Weekly Progress      │
│  ─────────────────────           ─────────────────    │
│  [Assignment card × N]           [Course bars × N]    │
│  [Exam card × N]                                      │
└───────────────────────────────────────────────────────┘

MOBILE LAYOUT (single column):
Stats Grid (2×2) → Upcoming List → Weekly Progress
```

**`StatsGrid` data derivation**:

```typescript
// views/Dashboard/StatsGrid.tsx
// All values derived from useMemo inside the component — no prop drilling

const dueSoon = useMemo(() =>
  Object.values(data.assignments).filter(a =>
    a.status !== 'done' &&
    daysUntil(a.dueDate) <= 7
  ).length,
[data.assignments]);

const upcomingExams = useMemo(() =>
  Object.values(data.exams).filter(e =>
    daysUntil(e.date) >= 0 && daysUntil(e.date) <= 14
  ).length,
[data.exams]);

const todayStudyHours = useMemo(() => {
  const today = new Date().toISOString().slice(0, 10);
  return Object.values(data.assignments)
    .flatMap(a => a.studySessions)
    .filter(s => s.startTime.startsWith(today))
    .reduce((sum, s) => sum + s.durationMins / 60, 0);
}, [data.assignments]);

const completionRate = useMemo(() => {
  const total = Object.keys(data.assignments).length;
  if (total === 0) return 0;
  const done = Object.values(data.assignments).filter(a => a.status === 'done').length;
  return Math.round((done / total) * 100);
}, [data.assignments]);
```

---

### 8.2 Kanban View — Drag-and-Drop Architecture

The Kanban board uses `@dnd-kit/core` with a **column-as-droppable, card-as-draggable** model. The critical rule is that optimistic UI update must happen *before* the drop animation completes — otherwise there's a visible "snap back" glitch.

```typescript
// views/Kanban/index.tsx

const columns: { id: Status; label: string; icon: LucideIcon }[] = [
  { id: 'todo',        label: 'To Do',       icon: Circle },
  { id: 'in_progress', label: 'In Progress', icon: PlayCircle },
  { id: 'review',      label: 'Review',      icon: Eye },
  { id: 'done',        label: 'Done',        icon: CheckCircle2 },
];

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  // `over.id` is the column's Status ID when dropped on a column droppable
  const newStatus = over.id as Status;
  dispatch({ type: 'MOVE_KANBAN', payload: { id: active.id as string, newStatus } });
}
```

**`useKanbanColumns` hook output**:

```typescript
interface KanbanColumn {
  status:      Status;
  label:       string;
  assignments: (Assignment & { course: Course })[];  // joined
  count:       number;
  wip?:        number;  // work-in-progress limit (optional feature)
}

function useKanbanColumns(): KanbanColumn[]
```

**Card drag overlay**: When dragging, `<DragOverlay>` renders a semi-transparent ghost of the card. The original card position shows a dashed placeholder (`bg-surface-100 dark:bg-surface-800 border-2 border-dashed border-surface-300`).

**Mobile drag behavior**: On touch devices, add a 200ms press delay (`activationConstraint: { delay: 200, tolerance: 5 }`) to distinguish scroll from drag.

---

### 8.3 Exam Scheduler View — Timeline Architecture

```
DESKTOP LAYOUT:
┌─────────────────────────────────────────────────────┐
│  [+ Add Exam]  [Filter: All Courses ▼]              │
├─────────────────────────┬───────────────────────────┤
│  UPCOMING               │  PAST                     │
│  ─────────────────      │  ─────────────────        │
│  [ExamCard × N]         │  [ExamCard (muted) × N]   │
└─────────────────────────┴───────────────────────────┘
```

**`ExamCard` anatomy**:

```
┌────────────────────────────────────────────┐
│  [Course color dot] MATH-201  [Quiz badge] │
│  Midterm Exam                              │
│  📅 Dec 15, 2025 · 09:00–11:00            │
│  📍 Hall B, Room 204                       │
│  ─────────────────────────────────────     │
│  [CountdownBadge: 14d 6h 22m]             │
│  Topics: Integration, Series (+2 more)    │
│  ──────────────────────────────────────── │
│  [Edit]                    [View Notes]   │
└────────────────────────────────────────────┘
```

**`ExamTimeline`** renders a horizontal scroll strip on desktop (vertical on mobile) with all upcoming exams as positioned pills. Each pill's left offset is calculated proportionally from today's date to the semester's end date:

```typescript
const leftPct = ((examDate - today) / (semesterEnd - today)) * 100;
// Clamped: Math.min(95, Math.max(0, leftPct))
// Rendered: style={{ left: `${leftPct}%` }}
```

---

### 8.4 Calendar View — Week Grid Architecture

```
WEEK VIEW LAYOUT:
         Mon      Tue      Wed      Thu      Fri      Sat      Sun
        ─────    ─────    ─────    ─────    ─────    ─────    ─────
        [pill]            [pill]            [pill]
                          [pill]
```

**Day column rules**:
- Each column is `flex-1 min-w-0` to distribute space evenly
- Today's column: `bg-brand-50 dark:bg-brand-950/20` + date circle highlighted
- Event pills are color-coded by `course.color`
- If more than 3 events in a day, show `+N more` overflow badge
- Clicking an event opens the assignment/exam detail modal

**`useWeeklyCalendar` output**:

```typescript
interface CalendarDay {
  date:        Date;
  label:       string;       // "Mon 14"
  isToday:     boolean;
  assignments: Assignment[];
  exams:       Exam[];
  total:       number;
  overflow:    number;       // total - 3 if > 3, else 0
}

function useWeeklyCalendar(weekStart: Date): CalendarDay[]
```

**Week navigation**: A `weekStart` state (initialized to Monday of current week) controls the displayed week. `prevWeek()` and `nextWeek()` shift by 7 days. A "Today" button resets to the current week.

---

### 8.5 Scratchpad View — Note Grid & Editor

```
GRID LAYOUT (masonry-style using CSS columns):
┌───────────────────────────────────────────────────┐
│  [+ New Note]  [Search notes...]  [Filter ▼]      │
├───────────────────────────────────────────────────┤
│  [📌 Pinned notes row]                            │
│  ──────────────────────                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Yellow  │  │  Default │  │  Blue    │        │
│  │  Note    │  │  Note    │  │  Note    │        │
│  │          │  │  (tall)  │  │          │        │
│  └──────────┘  │          │  └──────────┘        │
│                └──────────┘                       │
└───────────────────────────────────────────────────┘
```

**CSS columns approach** (no JS masonry library needed):

```css
.note-grid {
  column-count: 1;
  column-gap: 1rem;
}

@media (min-width: 640px)  { .note-grid { column-count: 2; } }
@media (min-width: 1024px) { .note-grid { column-count: 3; } }
@media (min-width: 1280px) { .note-grid { column-count: 4; } }

.note-card {
  break-inside: avoid;
  margin-bottom: 1rem;
}
```

**`NoteEditor`** toggles between *edit mode* (plain `<textarea>`) and *preview mode* (`react-markdown` render). The toggle is a tab pair: `[✏️ Edit] [👁 Preview]`. Autosave fires 800ms after the last keystroke via `useDebounce`.

**Note color system**:

```typescript
const noteColorMap: Record<NoteColor, { bg: string; border: string }> = {
  default: { bg: 'bg-[--bg-card]',         border: 'border-[--border]' },
  yellow:  { bg: 'bg-yellow-50  dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' },
  blue:    { bg: 'bg-blue-50    dark:bg-blue-950/30',   border: 'border-blue-200   dark:border-blue-800' },
  green:   { bg: 'bg-green-50   dark:bg-green-950/30',  border: 'border-green-200  dark:border-green-800' },
  red:     { bg: 'bg-red-50     dark:bg-red-950/30',    border: 'border-red-200    dark:border-red-800' },
};
```

---

## 🔍 9. GLOBAL SEARCH ARCHITECTURE

### 9.1 Fuse.js Search Configuration

Global search is a **command-palette style overlay** (⌘K / Ctrl+K) that fuzzy-searches across all entity types simultaneously and groups results by type.

```typescript
// hooks/useGlobalSearch.ts

import Fuse from 'fuse.js';

// Three separate Fuse instances — each tuned for its data shape
const assignmentFuse = new Fuse(assignmentsList, {
  keys: [
    { name: 'title',       weight: 0.5 },
    { name: 'description', weight: 0.2 },
    { name: 'tags',        weight: 0.3 },
  ],
  threshold:        0.3,    // 0 = exact, 1 = match anything
  includeScore:     true,
  includeMatches:   true,   // for highlighting matched substrings
  minMatchCharLength: 2,
});

const examFuse = new Fuse(examsList, {
  keys: [
    { name: 'title',   weight: 0.5 },
    { name: 'topics',  weight: 0.4 },
    { name: 'notes',   weight: 0.1 },
  ],
  threshold: 0.3,
});

const courseFuse = new Fuse(coursesList, {
  keys: [
    { name: 'name',        weight: 0.6 },
    { name: 'code',        weight: 0.3 },
    { name: 'instructor',  weight: 0.1 },
  ],
  threshold: 0.2,   // stricter — course names are short and precise
});
```

### 9.2 Search Result Shape

```typescript
interface SearchResult {
  type:  'assignment' | 'exam' | 'course' | 'note';
  id:    string;
  title: string;
  subtitle: string;       // e.g. "MATH-201 · Due Dec 14"
  icon:  LucideIcon;
  score: number;          // lower = better match (Fuse score)
  matches?: FuseResultMatch[];  // for highlight rendering
}
```

### 9.3 Command Palette UX

```
KEYBOARD SHORTCUT: ⌘K (Mac) / Ctrl+K (Win/Linux)

┌────────────────────────────────────────────────┐
│  🔍  Search assignments, exams, notes...       │
├────────────────────────────────────────────────┤
│  ASSIGNMENTS                                   │
│  📋  Calculus HW 5           MATH-201 · 3d    │
│  📋  Physics Lab Report      PHYS-101 · 7d    │
├────────────────────────────────────────────────┤
│  EXAMS                                         │
│  📅  Calculus Midterm        MATH-201 · 14d   │
├────────────────────────────────────────────────┤
│  COURSES                                       │
│  📚  Calculus II             MATH-201          │
└────────────────────────────────────────────────┘
```

- Arrow keys navigate results; Enter opens the selected item
- Results re-compute on every keystroke via `useMemo` (Fuse is fast enough at < 500 items)
- Matched characters are highlighted in `brand-500` color using `fuseMatch` indices
- `Escape` closes the palette and returns focus to the previously focused element

---

## ♿ 10. ACCESSIBILITY SPECIFICATION

### 10.1 WCAG 2.1 AA Compliance Checklist

Every interactive element must pass these requirements before a phase is marked complete:

**Color Contrast**:
- Normal text (< 18px): minimum 4.5:1 contrast ratio
- Large text (≥ 18px or 14px bold): minimum 3:1
- UI components and focus indicators: minimum 3:1
- Tool to verify: `npx @accessibility/color-contrast-checker`

**Keyboard Navigation**:
- All interactive elements reachable via `Tab` in logical DOM order
- No keyboard trap (except intentionally trapped modals)
- `Shift+Tab` works in reverse
- Custom components (`Kanban drag`, `CountdownBadge`) have keyboard equivalents

**Screen Reader Support**:
- All images have `alt` text (decorative images: `alt=""`)
- Form inputs have associated `<label>` elements (not just placeholder)
- Icon-only buttons have `aria-label` (e.g. `<button aria-label="Close modal">`)
- Live countdown uses `aria-live="polite"` to announce changes without interrupting
- Status changes (task moved to Done) announce via `aria-live="assertive"` region

**Focus Management**:
- Modal open: focus moves to first focusable element inside modal
- Modal close: focus returns to the element that triggered the modal
- Route navigation: focus moves to the `<h1>` of the new view (via `useEffect` + `ref.focus()`)

### 10.2 Semantic HTML Rules

```
View headings:     <h1> per view (one per page)
Section headings:  <h2> for major sections (Stats, Upcoming, etc.)
Cards list:        <ul> + <li> (not div soup)
Nav elements:      <nav> with aria-label="Main navigation"
Kanban columns:    role="list" with aria-label="Todo column" etc.
Form errors:       aria-describedby pointing to error message element
Loading states:    aria-busy="true" on the loading container
```

---

## ⚡ 11. PERFORMANCE BUDGET & OPTIMIZATION STRATEGY

### 11.1 Bundle Size Budget

| Asset | Budget | Strategy |
|---|---|---|
| Initial JS (gzipped) | < 120KB | Code-split by route via `React.lazy` |
| CSS (gzipped) | < 20KB | Tailwind purge removes unused classes |
| Total first load | < 200KB | Lazy-load `react-markdown`, `fuse.js`, `@dnd-kit` |
| Largest Contentful Paint | < 1.5s | No layout-blocking fonts (use `font-display: swap`) |
| Time to Interactive | < 2.0s | Defer non-critical JS |

### 11.2 Code Splitting Strategy

```typescript
// App.tsx — all routes are lazy-loaded

const Dashboard      = lazy(() => import('./views/Dashboard'));
const Kanban         = lazy(() => import('./views/Kanban'));
const ExamScheduler  = lazy(() => import('./views/ExamScheduler'));
const Calendar       = lazy(() => import('./views/Calendar'));
const Scratchpad     = lazy(() => import('./views/Scratchpad'));
const Courses        = lazy(() => import('./views/Courses'));

// Each view is wrapped in Suspense with a skeleton fallback
<Suspense fallback={<ViewSkeleton />}>
  <Routes>
    <Route path="/"        element={<Dashboard /> } />
    <Route path="/kanban"  element={<Kanban />} />
    ...
  </Routes>
</Suspense>
```

**Heavy libraries** loaded on demand:
- `fuse.js` — imported only when search palette opens
- `react-markdown` — imported only inside `Scratchpad` route chunk
- `@dnd-kit/core` — imported only inside `Kanban` route chunk

### 11.3 Re-render Prevention Checklist

Before marking any component complete, verify with React DevTools Profiler:

- [ ] `StatsGrid` does not re-render when a note is edited (unrelated state change)
- [ ] `KanbanCard` only re-renders when its own assignment data changes (use `React.memo`)
- [ ] `CountdownBadge` does not cause its parent `ExamCard` to re-render every second (the badge is isolated and subscribes only to its own timer state)
- [ ] `SidebarNav` does not re-render on `filterState` changes
- [ ] `PomodoroWidget` ticks do not re-render the `Dashboard` view's stats

### 11.4 `React.memo` Usage Policy

```typescript
// Apply React.memo to components that:
// 1. Receive stable props (primitives or memoized objects)
// 2. Are rendered in a list (KanbanCard, ExamCard, NoteCard, CourseCard)
// 3. Are expensive to render (contain charts or many children)

export const KanbanCard = React.memo(function KanbanCard({ assignment, course }: KanbanCardProps) {
  // ...
});

// DO NOT apply React.memo to:
// - Components that always receive new object/function props (memo never hits)
// - Cheap leaf components (Button, Badge, Icon) — overhead exceeds benefit
// - Context consumer components (they re-render on context change regardless)
```

---

## 🔔 12. NOTIFICATION & BROWSER API INTEGRATION

### 12.1 Notification Permission Flow

```typescript
// utils/notifications.ts

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    icon:  '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    ...options,
  });
}
```

**Notification triggers** (registered inside `usePomodoro`):
- Work phase complete: `"🍅 Focus session complete! Time for a break."`
- Break complete: `"⏰ Break's over. Ready to focus?"`
- Exam due tomorrow: checked once per hour via `setInterval` in `App.tsx`
- Assignment overdue: checked on app focus (`visibilitychange` event)

### 12.2 PWA Manifest

```json
// public/manifest.json
{
  "name": "University Planner",
  "short_name": "UniPlan",
  "description": "Your all-in-one academic planning dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-72.png",   "sizes": "72x72",   "type": "image/png" },
    { "src": "/icons/icon-96.png",   "sizes": "96x96",   "type": "image/png" },
    { "src": "/icons/icon-128.png",  "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png",  "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png",  "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png",  "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-384.png",  "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png",  "sizes": "512x512", "type": "image/png" }
  ],
  "shortcuts": [
    {
      "name":        "Add Assignment",
      "short_name":  "New Task",
      "url":         "/?action=new-assignment",
      "icons":       [{ "src": "/icons/shortcut-add.png", "sizes": "96x96" }]
    },
    {
      "name":       "Today's Schedule",
      "short_name": "Today",
      "url":        "/calendar?view=day"
    }
  ]
}
```

### 12.3 Service Worker Strategy (via `vite-plugin-pwa`)

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
      },
      {
        // Network-first for API calls (if added later)
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 },
      },
    ],
  },
})
```

**Offline behavior**: The entire app works offline because all data is in `localStorage`. The service worker caches all static assets. The only features degraded offline are: web fonts (fallback to system fonts), and any future server sync features.

---

## 🧪 13. TESTING STRATEGY

### 13.1 Testing Stack

| Layer | Tool | What it tests |
|---|---|---|
| Unit | Vitest | Pure functions in `utils/`, reducer logic |
| Hook | `@testing-library/react` + `renderHook` | `useCountdown`, `usePomodoro`, `useFilteredAssignments` |
| Component | `@testing-library/react` | Atomic components in isolation |
| Integration | `@testing-library/react` | Full `PlannerProvider` + view interactions |
| Accessibility | `axe-core` via `vitest-axe` | Every view and modal |
| E2E (optional) | Playwright | Critical user flows end-to-end |

### 13.2 Unit Test Examples

```typescript
// utils/date.test.ts
describe('daysUntil', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(daysUntil(today)).toBe(0);
  });
  it('returns negative for past dates', () => {
    expect(daysUntil('2020-01-01')).toBeLessThan(0);
  });
});

// context/dataReducer.test.ts
describe('DELETE_COURSE cascade', () => {
  it('removes all linked assignments when a course is deleted', () => {
    const state = buildStateWithCourse('c1', ['a1', 'a2']);
    const next  = dataReducer(state, { type: 'DELETE_COURSE', payload: { id: 'c1' } });
    expect(next.courses['c1']).toBeUndefined();
    expect(next.assignments['a1']).toBeUndefined();
    expect(next.assignments['a2']).toBeUndefined();
    expect(next.assignmentIds).not.toContain('a1');
  });
});
```

### 13.3 Hook Test Examples

```typescript
// hooks/useCountdown.test.ts
describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('decrements seconds on each tick', () => {
    const future = new Date(Date.now() + 5000).toISOString();
    const { result } = renderHook(() => useCountdown(future));

    expect(result.current.seconds).toBeGreaterThan(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.seconds).toBeLessThan(5);
  });

  it('does not leak the interval after unmount', () => {
    const future  = new Date(Date.now() + 60_000).toISOString();
    const clearSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useCountdown(future));
    unmount();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('returns expired=true when target date has passed', () => {
    const past = new Date(Date.now() - 1000).toISOString();
    const { result } = renderHook(() => useCountdown(past));
    expect(result.current.expired).toBe(true);
  });
});
```

### 13.4 Accessibility Test Example

```typescript
// views/Dashboard/Dashboard.a11y.test.tsx
import { axe } from 'vitest-axe';

it('Dashboard has no accessibility violations', async () => {
  const { container } = render(
    <PlannerProvider>
      <Dashboard />
    </PlannerProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 📁 14. SEED DATA & INITIAL STATE

### 14.1 Complete Seed Dataset

The seed data allows the app to feel alive on first launch — a critical UX detail. Nobody wants to stare at empty states before they understand the product.

```typescript
// context/initialState.ts

export const seedCourses: Record<string, Course> = {
  'course-1': {
    id: 'course-1', name: 'Calculus II', code: 'MATH-201',
    color: 'indigo', instructor: 'Dr. Sarah Chen', credits: 4,
    semester: 'Fall 2025',
    schedule: { days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '10:00', location: 'Math Hall 201' },
    createdAt: '2025-09-01T00:00:00Z', isArchived: false,
  },
  'course-2': {
    id: 'course-2', name: 'Physics I', code: 'PHYS-101',
    color: 'teal', instructor: 'Prof. James Miller', credits: 3,
    semester: 'Fall 2025',
    schedule: { days: ['Tue', 'Thu'], startTime: '13:00', endTime: '14:30', location: 'Science Block B' },
    createdAt: '2025-09-01T00:00:00Z', isArchived: false,
  },
  'course-3': {
    id: 'course-3', name: 'World History', code: 'HIST-110',
    color: 'amber', instructor: 'Dr. Lisa Park', credits: 3,
    semester: 'Fall 2025',
    schedule: { days: ['Mon', 'Wed'], startTime: '14:00', endTime: '15:15', location: 'Humanities 305' },
    createdAt: '2025-09-01T00:00:00Z', isArchived: false,
  },
};

export const seedAssignments: Record<string, Assignment> = {
  'assign-1': {
    id: 'assign-1', courseId: 'course-1',
    title: 'Problem Set 5 — Integration Techniques',
    description: 'Complete problems 1–20 from Chapter 7. Show all working.',
    dueDate: '2025-12-10', dueTime: '23:59', priority: 'high', status: 'in_progress',
    estimatedHrs: 3, actualHrs: 1.5, tags: ['homework', 'calculus'],
    attachments: [], studySessions: [], createdAt: '2025-11-28T10:00:00Z', updatedAt: '2025-11-28T10:00:00Z',
  },
  'assign-2': {
    id: 'assign-2', courseId: 'course-2',
    title: 'Lab Report — Projectile Motion',
    description: 'Write up the lab from Week 11. Include error analysis section.',
    dueDate: '2025-12-08', dueTime: '17:00', priority: 'critical', status: 'todo',
    estimatedHrs: 4, actualHrs: 0, tags: ['lab', 'report'],
    attachments: [], studySessions: [], createdAt: '2025-11-25T08:00:00Z', updatedAt: '2025-11-25T08:00:00Z',
  },
  'assign-3': {
    id: 'assign-3', courseId: 'course-3',
    title: 'Essay — Causes of WWI',
    description: '1500-word analytical essay. Chicago style citations required.',
    dueDate: '2025-12-15', dueTime: '23:59', priority: 'medium', status: 'todo',
    estimatedHrs: 5, actualHrs: 0, tags: ['essay', 'research'],
    attachments: [], studySessions: [], createdAt: '2025-11-20T09:00:00Z', updatedAt: '2025-11-20T09:00:00Z',
  },
};

export const seedExams: Record<string, Exam> = {
  'exam-1': {
    id: 'exam-1', courseId: 'course-1',
    title: 'Final Exam', type: 'final',
    date: '2025-12-18', startTime: '09:00', endTime: '12:00',
    location: 'Exam Hall A, Seat 42', weight: 40,
    topics: ['Integration by parts', 'Series & sequences', 'L\'Hôpital\'s rule', 'Polar coordinates'],
    notes: 'Review all Chapter 6–9 exercises. Focus on Series convergence tests.',
    createdAt: '2025-09-01T00:00:00Z',
  },
  'exam-2': {
    id: 'exam-2', courseId: 'course-2',
    title: 'Physics Midterm 2', type: 'midterm',
    date: '2025-12-11', startTime: '14:00', endTime: '16:00',
    location: 'Science Block B, Room 201', weight: 25,
    topics: ['Newton\'s Laws', 'Work & Energy', 'Momentum'],
    notes: 'Bring calculator. Formula sheet provided.',
    createdAt: '2025-10-01T00:00:00Z',
  },
};
```

---

## 🗺️ 15. ROUTING & NAVIGATION SPECIFICATION

### 15.1 Route Map

```typescript
// App.tsx route config

const routes = [
  { path: '/',                  view: 'Dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/kanban',            view: 'Kanban',        label: 'Assignments',   icon: Columns },
  { path: '/exams',             view: 'ExamScheduler', label: 'Exams',         icon: CalendarCheck },
  { path: '/calendar',          view: 'Calendar',      label: 'Calendar',      icon: Calendar },
  { path: '/courses',           view: 'Courses',       label: 'Courses',       icon: BookOpen },
  { path: '/courses/:courseId', view: 'CourseDetail',  label: null,            icon: null },  // no nav item
  { path: '/scratchpad',        view: 'Scratchpad',    label: 'Notes',         icon: StickyNote },
];
```

The `NAV_ITEMS` constant filters out routes where `label === null` (detail pages not in nav).

### 15.2 URL State for Deep Linking

Filter state is **not** stored in the URL by default (it lives in context), but the following params are URL-driven to support deep links and browser back/forward:

```
/kanban?status=in_progress          → pre-filter Kanban to In Progress column
/calendar?week=2025-12-09           → open Calendar to specific week
/courses/course-1                   → open Course Detail for course-1
/?action=new-assignment             → open Add Assignment modal on Dashboard (PWA shortcut)
```

These are handled via `useSearchParams` inside each view's `index.tsx` with a `useEffect` that syncs URL params to `filterState` on mount.

---

## 🚦 16. ERROR HANDLING & EDGE CASE GUIDE

### 16.1 LocalStorage Edge Cases

| Scenario | Handling |
|---|---|
| `localStorage` is full (quota exceeded) | Catch `QuotaExceededError`, show toast: "Storage full — oldest sessions will be pruned." Auto-prune `studySessions` older than 90 days |
| `localStorage` is disabled (private mode) | `safeJSONParse` returns `null`, app starts fresh with seed data. No crash. |
| Corrupted JSON in storage | `safeJSONParse` returns `null` via try/catch. `HYDRATE` is not dispatched. Seed data used. |
| Schema version mismatch (future migration) | Store `schemaVersion: 1` in state. On hydrate, compare version — if mismatch, run migration function before dispatching HYDRATE. |

### 16.2 Data Validation Rules (Form-Level)

```typescript
// utils/validation.ts

const assignmentValidation = {
  title:        { required: true, maxLength: 120 },
  dueDate:      { required: true, validate: (d: string) => new Date(d) >= new Date() || 'Due date is in the past' },
  estimatedHrs: { min: 0.25, max: 100, step: 0.25 },
  courseId:     { required: true, validate: (id: string, ctx: PlannerState) => !!ctx.courses[id] || 'Course not found' },
};

const examValidation = {
  title:     { required: true, maxLength: 100 },
  date:      { required: true },
  startTime: { required: true },
  endTime:   { required: true, validate: (end: string, form: ExamFormValues) => end > form.startTime || 'End time must be after start time' },
  weight:    { min: 0, max: 100 },
};
```

### 16.3 Empty State Catalog

Every view must handle zero-data gracefully. Here is the complete catalog of empty states:

| View | Condition | Icon | Title | CTA |
|---|---|---|---|---|
| Dashboard | No courses | `GraduationCap` | "Add your first course" | "Add Course" button |
| Dashboard | No upcoming items | `PartyPopper` | "You're all caught up!" | None |
| Kanban | No assignments | `ClipboardList` | "No assignments yet" | "Add Assignment" |
| Kanban | Column empty | `CheckSquare` | "Nothing here" | None (subtle) |
| ExamScheduler | No exams | `CalendarX` | "No exams scheduled" | "Add Exam" |
| Calendar | No events this week | `CalendarDays` | "Clear week ahead" | None |
| Courses | No courses | `BookOpen` | "No courses added" | "Add Course" |
| Scratchpad | No notes | `StickyNote` | "Your scratchpad is empty" | "New Note" |
| Search | No results | `SearchX` | "No results for '{query}'" | None |

---

## 📋 17. COMPLETE DEPENDENCY MANIFEST

```json
{
  "dependencies": {
    "react":                 "^19.0.0",
    "react-dom":             "^19.0.0",
    "react-router-dom":      "^6.26.0",
    "lucide-react":          "^0.400.0",
    "@dnd-kit/core":         "^6.1.0",
    "@dnd-kit/sortable":     "^8.0.0",
    "@dnd-kit/utilities":    "^3.2.2",
    "react-markdown":        "^9.0.1",
    "remark-gfm":            "^4.0.0",
    "fuse.js":               "^7.0.0",
    "@floating-ui/react":    "^0.26.0"
  },
  "devDependencies": {
    "typescript":            "^5.5.0",
    "vite":                  "^5.4.0",
    "vite-plugin-pwa":       "^0.20.0",
    "@vitejs/plugin-react":  "^4.3.0",
    "tailwindcss":           "^3.4.0",
    "autoprefixer":          "^10.4.0",
    "postcss":               "^8.4.0",
    "vitest":                "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest-axe":            "^0.1.0",
    "axe-core":              "^4.10.0",
    "@types/react":          "^19.0.0",
    "@types/react-dom":      "^19.0.0"
  }
}
```

---

## 📊 18. FEATURE COMPARISON MATRIX

| Feature | Notion | Todoist | Shovel App | **UniPlan** |
|---|---|---|---|---|
| Kanban Board | ✅ | ❌ | ❌ | ✅ |
| Smart Filters | ✅ | ✅ | ❌ | ✅ |
| Live Countdown Timers | ❌ | ❌ | ✅ | ✅ |
| Pomodoro Timer | ❌ | ❌ | ✅ | ✅ |
| Session Logs per Task | ❌ | ❌ | ✅ | ✅ |
| Course-aware Analytics | ❌ | ❌ | ✅ | ✅ |
| Offline PWA | ❌ | ✅ | ❌ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ | ✅ |
| Markdown Notes | ✅ | ❌ | ❌ | ✅ |
| Global Fuzzy Search | ✅ | ✅ | ❌ | ✅ |
| Keyboard Shortcuts | ✅ | ✅ | ❌ | ✅ |
| Free / No Account | ❌ | ❌ | ❌ | ✅ (localStorage) |
| Mobile Bottom Nav | ❌ | ✅ | ✅ | ✅ |
| Exam Weight Tracking | ❌ | ❌ | ✅ | ✅ |
| Cross-tab Sync | ✅ | ✅ | ❌ | ✅ |

---

*Do you approve this architectural blueprint? If yes, tell me which Phase of the plan you want me to write the actual code for first.*

