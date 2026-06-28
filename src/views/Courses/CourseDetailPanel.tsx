import React from 'react';
import { Calendar, MapPin, User, GraduationCap, ClipboardList, Clock, StickyNote, Play } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import { useCourseStats } from '../../hooks/useCourseStats';
import type { CourseStats } from '../../hooks/useCourseStats';
import { formatDate } from '../../utils/date';
import Modal from '../../components/ui/Modal';
import CountdownBadge from '../../components/shared/CountdownBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import { usePomodoro } from '../../hooks/usePomodoro';

export interface CourseDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
}

export const CourseDetailPanel: React.FC<CourseDetailPanelProps> = ({
  isOpen,
  onClose,
  courseId,
}) => {
  const { data, dispatch: dataDispatch } = usePlannerData();
  const { start: startPomodoro } = usePomodoro();

  if (!courseId || !data.courses[courseId]) return null;

  const course = data.courses[courseId];
  const stats = useCourseStats(courseId) as CourseStats | null;

  // Filter assignments, exams, notes for this course
  const assignments = Object.values(data.assignments).filter(a => a.courseId === courseId);
  const exams = Object.values(data.exams).filter(e => e.courseId === courseId);
  const notes = Object.values(data.notes).filter(n => n.courseId === courseId);

  const handleToggleComplete = (assignmentId: string) => {
    const isDone = data.assignments[assignmentId]?.status === 'done';
    dataDispatch({
      type: 'UPDATE_ASSIGNMENT',
      payload: {
        id: assignmentId,
        changes: { status: isDone ? 'todo' : 'done' },
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course.name}
      description={`${course.code} · ${course.semester}`}
      size="xl"
    >
      <div className="space-y-6 select-none">
        {/* Course Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-[--border] flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[--text-secondary] uppercase">Instructor</p>
              <p className="text-xs font-semibold text-[--text-primary] truncate">{course.instructor || 'N/A'}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-[--border] flex items-center gap-3">
            <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[--text-secondary] uppercase">Location</p>
              <p className="text-xs font-semibold text-[--text-primary] truncate">{course.schedule.location || 'N/A'}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-[--border] flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[--text-secondary] uppercase">Schedule</p>
              <p className="text-xs font-semibold text-[--text-primary] truncate">
                {course.schedule.days.join('/')} {course.schedule.startTime}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-[--border] flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[--text-secondary] uppercase">Credits</p>
              <p className="text-xs font-semibold text-[--text-primary] truncate">{course.credits} Credits</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {stats && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-[--border] space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-[--text-secondary]">
              <span>COURSE PROGRESSION</span>
              <span>{stats.completedAssignments} / {stats.totalAssignments} ASSIGNMENTS DONE</span>
            </div>
            <ProgressBar value={stats.completionRate} color={course.color as any} showValue />
            <div className="grid grid-cols-2 gap-4 text-xs pt-1 text-[--text-secondary]">
              <div>Estimated Workload: <strong className="text-[--text-primary]">{stats.totalEstimatedHrs}h</strong></div>
              <div>Actual Focus Logged: <strong className="text-[--text-primary]">{stats.totalActualHrs.toFixed(1)}h</strong></div>
            </div>
          </div>
        )}

        {/* Course Elements Tabs / Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Assignments Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2 border-b border-[--border] pb-2">
              <ClipboardList className="w-4 h-4 text-brand-500" />
              Assignments ({assignments.length})
            </h3>
            {assignments.length === 0 ? (
              <p className="text-xs text-[--text-secondary] py-2">No assignments added yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {assignments.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2.5 bg-[--bg-card] border border-[--border] rounded-xl text-xs gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={a.status === 'done'}
                        onChange={() => handleToggleComplete(a.id)}
                        className="w-4 h-4 rounded border-[--border] text-brand-500 focus:ring-brand-500/20 cursor-pointer shrink-0"
                      />
                      <span className={`font-semibold truncate ${a.status === 'done' ? 'line-through text-[--text-muted]' : 'text-[--text-primary]'}`}>
                        {a.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {a.status !== 'done' && (
                        <button
                          onClick={() => startPomodoro(a.id)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 text-slate-500 hover:text-brand-500 transition-colors"
                          title="Start focus timer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}
                      <span className="text-[10px] text-[--text-secondary] shrink-0">
                        {formatDate(a.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exams Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2 border-b border-[--border] pb-2">
              <Clock className="w-4 h-4 text-teal-500" />
              Exams ({exams.length})
            </h3>
            {exams.length === 0 ? (
              <p className="text-xs text-[--text-secondary] py-2">No exams scheduled yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {exams.map(e => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-2.5 bg-[--bg-card] border border-[--border] rounded-xl text-xs gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[--text-primary] truncate">{e.title}</p>
                      <p className="text-[10px] text-[--text-secondary] mt-0.5">
                        {formatDate(e.date)} at {e.startTime} · {e.weight}%
                      </p>
                    </div>
                    <CountdownBadge targetDate={`${e.date}T${e.startTime}`} compact className="shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Linked Notes Section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2 border-b border-[--border] pb-2">
            <StickyNote className="w-4 h-4 text-amber-500" />
            Lecture Notes ({notes.length})
          </h3>
          {notes.length === 0 ? (
            <p className="text-xs text-[--text-secondary] py-2">No notes created for this course.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {notes.map(n => (
                <div
                  key={n.id}
                  className="p-3 bg-[--bg-card] border border-[--border] rounded-xl text-xs flex flex-col justify-between hover:border-brand-300 transition-colors cursor-pointer"
                >
                  <h4 className="font-bold text-[--text-primary] truncate mb-1">{n.title}</h4>
                  <p className="text-[10px] text-[--text-secondary] line-clamp-2 leading-relaxed mb-2">
                    {n.content.replace(/[#*`\-_[\]]/g, '')} {/* Strip markdown characters for preview */}
                  </p>
                  <span className="text-[9px] font-bold text-[--text-muted] tracking-wide uppercase">
                    Last updated {new Date(n.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CourseDetailPanel;
