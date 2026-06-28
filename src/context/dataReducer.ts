import type { PlannerState, Course, Assignment, Exam, Note } from '../types';

export type DataAction =
  | { type: 'ADD_COURSE';        payload: Course }
  | { type: 'UPDATE_COURSE';     payload: { id: string; changes: Partial<Course> } }
  | { type: 'DELETE_COURSE';     payload: { id: string } }
  | { type: 'ADD_ASSIGNMENT';    payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: { id: string; changes: Partial<Assignment> } }
  | { type: 'DELETE_ASSIGNMENT'; payload: { id: string } }
  | { type: 'MOVE_KANBAN';       payload: { id: string; newStatus: Assignment['status'] } }
  | { type: 'ADD_EXAM';          payload: Exam }
  | { type: 'UPDATE_EXAM';       payload: { id: string; changes: Partial<Exam> } }
  | { type: 'DELETE_EXAM';       payload: { id: string } }
  | { type: 'ADD_NOTE';          payload: Note }
  | { type: 'UPDATE_NOTE';       payload: { id: string; changes: Partial<Note> } }
  | { type: 'DELETE_NOTE';       payload: { id: string } }
  | { type: 'LOG_STUDY_SESSION'; payload: { assignmentId: string; durationMins: number; pomodoroCount: number; notes?: string } }
  | { type: 'HYDRATE';           payload: PlannerState };

export function dataReducer(state: PlannerState, action: DataAction): PlannerState {
  switch (action.type) {
    case 'ADD_COURSE': {
      const course = action.payload;
      return {
        ...state,
        courses: { ...state.courses, [course.id]: course },
        courseIds: [...state.courseIds, course.id],
      };
    }

    case 'UPDATE_COURSE': {
      const { id, changes } = action.payload;
      if (!state.courses[id]) return state;
      return {
        ...state,
        courses: {
          ...state.courses,
          [id]: { ...state.courses[id], ...changes },
        },
      };
    }

    case 'DELETE_COURSE': {
      const { id } = action.payload;
      
      // Cascade delete: find all assignments, exams, and notes linked to this course
      const orphanedAssignmentIds = state.assignmentIds.filter(
        aid => state.assignments[aid].courseId === id
      );
      const orphanedExamIds = state.examIds.filter(
        eid => state.exams[eid].courseId === id
      );
      
      // For notes, we delete course-linked notes. If they are linked to assignments that are also being deleted, they'll get cleaned up or made global.
      // But Cascade delete means deleting all notes that belong to this course.
      const orphanedNoteIds = state.noteIds.filter(
        nid => state.notes[nid].courseId === id
      );

      const newCourses = { ...state.courses };
      delete newCourses[id];

      const newAssignments = { ...state.assignments };
      orphanedAssignmentIds.forEach(aid => delete newAssignments[aid]);

      const newExams = { ...state.exams };
      orphanedExamIds.forEach(eid => delete newExams[eid]);

      const newNotes = { ...state.notes };
      orphanedNoteIds.forEach(nid => delete newNotes[nid]);

      return {
        ...state,
        courses: newCourses,
        courseIds: state.courseIds.filter(cid => cid !== id),
        assignments: newAssignments,
        assignmentIds: state.assignmentIds.filter(aid => !orphanedAssignmentIds.includes(aid)),
        exams: newExams,
        examIds: state.examIds.filter(eid => !orphanedExamIds.includes(eid)),
        notes: newNotes,
        noteIds: state.noteIds.filter(nid => !orphanedNoteIds.includes(nid)),
      };
    }

    case 'ADD_ASSIGNMENT': {
      const assignment = action.payload;
      return {
        ...state,
        assignments: { ...state.assignments, [assignment.id]: assignment },
        assignmentIds: [...state.assignmentIds, assignment.id],
      };
    }

    case 'UPDATE_ASSIGNMENT': {
      const { id, changes } = action.payload;
      if (!state.assignments[id]) return state;
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [id]: {
            ...state.assignments[id],
            ...changes,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'DELETE_ASSIGNMENT': {
      const { id } = action.payload;
      const newAssignments = { ...state.assignments };
      delete newAssignments[id];

      // Also clean up any notes linked to this assignment (set linkedItemId/Type to null)
      const newNotes = { ...state.notes };
      state.noteIds.forEach(nid => {
        if (newNotes[nid].linkedItemId === id && newNotes[nid].linkedItemType === 'assignment') {
          newNotes[nid] = {
            ...newNotes[nid],
            linkedItemId: null,
            linkedItemType: null,
          };
        }
      });

      return {
        ...state,
        assignments: newAssignments,
        assignmentIds: state.assignmentIds.filter(aid => aid !== id),
        notes: newNotes,
      };
    }

    case 'MOVE_KANBAN': {
      const { id, newStatus } = action.payload;
      if (!state.assignments[id]) return state;
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [id]: {
            ...state.assignments[id],
            status: newStatus,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'ADD_EXAM': {
      const exam = action.payload;
      return {
        ...state,
        exams: { ...state.exams, [exam.id]: exam },
        examIds: [...state.examIds, exam.id],
      };
    }

    case 'UPDATE_EXAM': {
      const { id, changes } = action.payload;
      if (!state.exams[id]) return state;
      return {
        ...state,
        exams: {
          ...state.exams,
          [id]: { ...state.exams[id], ...changes },
        },
      };
    }

    case 'DELETE_EXAM': {
      const { id } = action.payload;
      const newExams = { ...state.exams };
      delete newExams[id];

      // Also clean up any notes linked to this exam
      const newNotes = { ...state.notes };
      state.noteIds.forEach(nid => {
        if (newNotes[nid].linkedItemId === id && newNotes[nid].linkedItemType === 'exam') {
          newNotes[nid] = {
            ...newNotes[nid],
            linkedItemId: null,
            linkedItemType: null,
          };
        }
      });

      return {
        ...state,
        exams: newExams,
        examIds: state.examIds.filter(eid => eid !== id),
        notes: newNotes,
      };
    }

    case 'ADD_NOTE': {
      const note = action.payload;
      return {
        ...state,
        notes: { ...state.notes, [note.id]: note },
        noteIds: [note.id, ...state.noteIds], // New notes appear first by default
      };
    }

    case 'UPDATE_NOTE': {
      const { id, changes } = action.payload;
      if (!state.notes[id]) return state;
      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: {
            ...state.notes[id],
            ...changes,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'DELETE_NOTE': {
      const { id } = action.payload;
      const newNotes = { ...state.notes };
      delete newNotes[id];
      return {
        ...state,
        notes: newNotes,
        noteIds: state.noteIds.filter(nid => nid !== id),
      };
    }

    case 'LOG_STUDY_SESSION': {
      const { assignmentId, durationMins, pomodoroCount, notes } = action.payload;
      const assignment = state.assignments[assignmentId];
      if (!assignment) return state;

      const newSession = {
        id: 'session-' + Math.random().toString(36).substring(2, 11),
        assignmentId,
        startTime: new Date(Date.now() - durationMins * 60000).toISOString(),
        endTime: new Date().toISOString(),
        durationMins,
        pomodoroCount,
        notes: notes || 'Completed study session',
      };

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [assignmentId]: {
            ...assignment,
            studySessions: [...assignment.studySessions, newSession],
            actualHrs: assignment.actualHrs + durationMins / 60,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case 'HYDRATE': {
      if (!action.payload?.courses || !action.payload?.assignments) return state;
      return action.payload;
    }

    default:
      return state;
  }
}
