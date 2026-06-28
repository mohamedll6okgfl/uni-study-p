import type { PlannerState, UIState, Course, Assignment, Exam, Note } from '../types';

export const seedCourses: Record<string, Course> = {
  'course-1': {
    id: 'course-1',
    name: 'Calculus II',
    code: 'MATH-201',
    color: 'indigo',
    instructor: 'Dr. Sarah Chen',
    credits: 4,
    semester: 'Fall 2025',
    schedule: {
      days: ['Mon', 'Wed', 'Fri'],
      startTime: '09:00',
      endTime: '10:00',
      location: 'Math Hall 201',
    },
    createdAt: '2025-09-01T00:00:00Z',
    isArchived: false,
  },
  'course-2': {
    id: 'course-2',
    name: 'Physics I',
    code: 'PHYS-101',
    color: 'teal',
    instructor: 'Prof. James Miller',
    credits: 3,
    semester: 'Fall 2025',
    schedule: {
      days: ['Tue', 'Thu'],
      startTime: '13:00',
      endTime: '14:30',
      location: 'Science Block B',
    },
    createdAt: '2025-09-01T00:00:00Z',
    isArchived: false,
  },
  'course-3': {
    id: 'course-3',
    name: 'World History',
    code: 'HIST-110',
    color: 'amber',
    instructor: 'Dr. Lisa Park',
    credits: 3,
    semester: 'Fall 2025',
    schedule: {
      days: ['Mon', 'Wed'],
      startTime: '14:00',
      endTime: '15:15',
      location: 'Humanities 305',
    },
    createdAt: '2025-09-01T00:00:00Z',
    isArchived: false,
  },
};

// Set due dates relative to current date to keep the dashboard dynamic and active
const getRelativeDateString = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
};

export const seedAssignments: Record<string, Assignment> = {
  'assign-1': {
    id: 'assign-1',
    courseId: 'course-1',
    title: 'Problem Set 5 — Integration Techniques',
    description: 'Complete problems 1–20 from Chapter 7. Show all working. Focus on integration by parts and trigonometric substitution.',
    dueDate: getRelativeDateString(3), // 3 days in the future
    dueTime: '23:59',
    priority: 'high',
    status: 'in_progress',
    estimatedHrs: 3,
    actualHrs: 1.5,
    tags: ['homework', 'calculus'],
    attachments: [],
    studySessions: [
      {
        id: 'session-1',
        assignmentId: 'assign-1',
        startTime: new Date(Date.now() - 3600000 * 24).toISOString(), // yesterday
        endTime: new Date(Date.now() - 3600000 * 24 + 5400000).toISOString(), // 1.5 hours session
        durationMins: 90,
        pomodoroCount: 3,
        notes: 'Worked through problems 1-10. Tricky integration by parts.',
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  'assign-2': {
    id: 'assign-2',
    courseId: 'course-2',
    title: 'Lab Report — Projectile Motion',
    description: 'Write up the lab from Week 11. Include error analysis section, experimental setup, and graphs of trajectories.',
    dueDate: getRelativeDateString(1), // tomorrow
    dueTime: '17:00',
    priority: 'critical',
    status: 'todo',
    estimatedHrs: 4,
    actualHrs: 0,
    tags: ['lab', 'report'],
    attachments: [],
    studySessions: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  'assign-3': {
    id: 'assign-3',
    courseId: 'course-3',
    title: 'Essay — Causes of WWI',
    description: '1500-word analytical essay. Chicago style citations required. Analyze the alliance systems, militarism, and the assassination of Archduke Franz Ferdinand.',
    dueDate: getRelativeDateString(10), // 10 days in the future
    dueTime: '23:59',
    priority: 'medium',
    status: 'todo',
    estimatedHrs: 5,
    actualHrs: 0,
    tags: ['essay', 'research'],
    attachments: [],
    studySessions: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  'assign-4': {
    id: 'assign-4',
    courseId: 'course-1',
    title: 'Calculus Quiz 4 Prep',
    description: 'Review improper integrals and L\'Hopital\'s Rule. Do textbook practice questions.',
    dueDate: getRelativeDateString(-2), // 2 days ago
    dueTime: '09:00',
    priority: 'low',
    status: 'done',
    estimatedHrs: 2,
    actualHrs: 2.5,
    tags: ['quiz', 'prep'],
    attachments: [],
    studySessions: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  }
};

export const seedExams: Record<string, Exam> = {
  'exam-1': {
    id: 'exam-1',
    courseId: 'course-1',
    title: 'Final Exam',
    type: 'final',
    date: getRelativeDateString(14), // 2 weeks in the future
    startTime: '09:00',
    endTime: '12:00',
    location: 'Exam Hall A, Seat 42',
    weight: 40,
    topics: ['Integration by parts', 'Series & sequences', 'L\'Hôpital\'s rule', 'Polar coordinates'],
    notes: 'Review all Chapter 6–9 exercises. Focus on Series convergence tests and Taylor series expansions.',
    createdAt: '2025-09-01T00:00:00Z',
  },
  'exam-2': {
    id: 'exam-2',
    courseId: 'course-2',
    title: 'Physics Midterm 2',
    type: 'midterm',
    date: getRelativeDateString(7), // 1 week in the future
    startTime: '14:00',
    endTime: '16:00',
    location: 'Science Block B, Room 201',
    weight: 25,
    topics: ['Newton\'s Laws', 'Work & Energy', 'Momentum', 'Rotational Motion'],
    notes: 'Bring calculator. Formula sheet provided. Study previous practice exams.',
    createdAt: '2025-10-01T00:00:00Z',
  },
};

export const seedNotes: Record<string, Note> = {
  'note-1': {
    id: 'note-1',
    courseId: 'course-1',
    linkedItemId: 'assign-1',
    linkedItemType: 'assignment',
    title: 'Calculus Integration Formulas',
    content: `# Integration Formulas to Memorize

## Basic Rules
- $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$
- $\\int \\frac{1}{x} dx = \\ln|x| + C$
- $\\int e^x dx = e^x + C$

## Integration by Parts
- $\\int u \\, dv = uv - \\int v \\, du$
- Choosing $u$ order: **LIATE** (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential)

## Trig Substitutions
- For $\\sqrt{a^2 - x^2}$ use $x = a \\sin\\theta$
- For $\\sqrt{a^2 + x^2}$ use $x = a \\tan\\theta$
- For $\\sqrt{x^2 - a^2}$ use $x = a \\sec\\theta$
`,
    color: 'blue',
    isPinned: true,
    tags: ['calculus', 'cheatsheet'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  'note-2': {
    id: 'note-2',
    courseId: 'course-3',
    linkedItemId: null,
    linkedItemType: null,
    title: 'WWI Causes Outline',
    content: `# Main Causes of World War I

1. **Militarism**: Anglo-German naval arms race.
2. **Alliances**: Triple Entente vs Triple Alliance.
3. **Imperialism**: Scramble for Africa, Balkan crises.
4. **Nationalism**: Slavic nationalism in Austro-Hungarian Empire.

*Immediate trigger:* Assassination of Archduke Franz Ferdinand in Sarajevo (June 28, 1914).
`,
    color: 'yellow',
    isPinned: false,
    tags: ['history', 'outline'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  'note-3': {
    id: 'note-3',
    courseId: null,
    linkedItemId: null,
    linkedItemType: null,
    title: 'General Study Tips',
    content: `# High-Yield Study Strategies

- **Active Recall**: Don't just re-read notes; test yourself.
- **Spaced Repetition**: Review material at expanding intervals (1 day, 3 days, 7 days, etc.).
- **Feynman Technique**: Explain concepts in simple terms as if teaching a child.
- **Pomodoro**: Focus for 25 minutes, break for 5. Repeat.
`,
    color: 'green',
    isPinned: true,
    tags: ['productivity', 'tips'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  }
};

export const initialDataState: PlannerState = {
  courses: seedCourses,
  assignments: seedAssignments,
  exams: seedExams,
  notes: seedNotes,
  courseIds: Object.keys(seedCourses),
  assignmentIds: Object.keys(seedAssignments),
  examIds: Object.keys(seedExams),
  noteIds: Object.keys(seedNotes),
};

export const initialUIState: UIState = {
  theme: 'system',
  sidebarCollapsed: false,
  activeView: 'Dashboard',
  activeCourseId: null,
  pomodoroState: {
    isActive: false,
    isPaused: false,
    assignmentId: null,
    phase: 'work',
    secondsLeft: 1500, // 25 minutes
    sessionsCompleted: 0,
  },
  filterState: {
    courseIds: [],
    priorities: [],
    statuses: [],
    dateRange: { from: null, to: null },
    searchQuery: '',
    sortBy: 'dueDate',
    sortDir: 'asc',
  },
};
export const initialFilterState = initialUIState.filterState;
