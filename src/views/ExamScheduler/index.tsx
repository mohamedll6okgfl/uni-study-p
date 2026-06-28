import React, { useState, useMemo } from 'react';
import { Plus, Calendar, MapPin, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import type { Exam } from '../../types';
import { daysUntil, formatDate } from '../../utils/date';
import { getCourseColorClasses } from '../../utils/color';
import ExamForm from '../../components/forms/ExamForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CountdownBadge from '../../components/shared/CountdownBadge';
import EmptyState from '../../components/ui/EmptyState';

export const ExamScheduler: React.FC = () => {
  const { data, dispatch } = usePlannerData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Group and sort exams
  const { upcomingExams, pastExams } = useMemo(() => {
    const upcoming: Exam[] = [];
    const past: Exam[] = [];
    
    Object.values(data.exams).forEach(e => {
      if (daysUntil(e.date) >= 0) {
        upcoming.push(e);
      } else {
        past.push(e);
      }
    });

    // Sort upcoming ascending
    upcoming.sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    // Sort past descending
    past.sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.startTime.localeCompare(a.startTime);
    });

    return { upcomingExams: upcoming, pastExams: past };
  }, [data.exams]);

  // Timeline calculations (next 30 days)
  const timelineExams = useMemo(() => {
    const start = Date.now();
    const range = 30 * 86400000; // 30 days
    const end = start + range;

    return upcomingExams
      .filter(e => {
        const time = new Date(e.date).getTime();
        return time >= start && time <= end;
      })
      .map(e => {
        const leftPct = ((new Date(e.date).getTime() - start) / range) * 100;
        return {
          exam: e,
          left: Math.min(92, Math.max(2, leftPct)),
        };
      });
  }, [upcomingExams]);

  const handleAddExam = () => {
    setSelectedExamId(null);
    setIsFormOpen(true);
  };

  const handleEditExam = (id: string) => {
    setSelectedExamId(id);
    setIsFormOpen(true);
  };

  const handleDeleteExam = (id: string) => {
    const e = data.exams[id];
    if (!e) return;

    const confirmed = window.confirm(`Remove exam "${e.title}" from scheduler?`);
    if (confirmed) {
      dispatch({
        type: 'DELETE_EXAM',
        payload: { id },
      });
    }
  };

  return (
    <div className="space-y-8 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">
            Exam Scheduler
          </h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Plan and monitor your exams, weights, and study preparation.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddExam}
        >
          Add Exam
        </Button>
      </div>

      {/* Visual Timeline (Only if there are upcoming exams in the next 30 days) */}
      {timelineExams.length > 0 && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
            30-Day Exam Horizon
          </h2>
          
          <div className="relative h-16 flex items-center border-b border-[--border] pb-4">
            {/* Timeline Bar Line */}
            <div className="absolute left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
            
            {/* Timeline Markers */}
            {timelineExams.map(({ exam, left }) => {
              const course = data.courses[exam.courseId];
              const colors = getCourseColorClasses(course?.color || 'indigo');
              
              return (
                <div
                  key={exam.id}
                  className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
                  style={{ left: `${left}%` }}
                  onClick={() => handleEditExam(exam.id)}
                >
                  {/* Dot */}
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-[--bg-card] shadow transition-transform group-hover:scale-125 ${colors.solid.split(' ')[0]}`} />
                  
                  {/* Label */}
                  <span className="text-[9px] font-bold text-[--text-secondary] mt-1 whitespace-nowrap bg-[--bg-card] border border-[--border] px-1.5 py-0.5 rounded shadow-sm opacity-80 group-hover:opacity-100 group-hover:border-brand-300 dark:group-hover:border-brand-800 transition-all">
                    {course?.code || 'GEN'}
                  </span>
                  
                  {/* Floating Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] p-2 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    <p className="font-bold">{exam.title}</p>
                    <p className="text-[9px] text-slate-300">{formatDate(exam.date)} · {exam.startTime}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] font-bold text-[--text-muted] uppercase tracking-wider px-1">
            <span>Today</span>
            <span>In 15 Days</span>
            <span>In 30 Days</span>
          </div>
        </Card>
      )}

      {/* Main Grid: Upcoming and Past splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Column */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[--text-primary] tracking-tight border-b border-[--border] pb-2">
            Upcoming Exams ({upcomingExams.length})
          </h2>

          {upcomingExams.length === 0 ? (
            <Card className="py-8 border-dashed">
              <EmptyState
                icon={<Calendar className="w-10 h-10 text-brand-500" />}
                title="No upcoming exams"
                description="Schedule your upcoming quizzes, midterms, or finals to stay prepared."
                action={{
                  label: 'Schedule Exam',
                  onClick: handleAddExam,
                }}
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingExams.map(exam => {
                const course = data.courses[exam.courseId];
                const colors = getCourseColorClasses(course?.color || 'indigo');
                
                return (
                  <Card
                    key={exam.id}
                    padding="md"
                    className="border-l-4 hover:border-brand-300 dark:hover:border-brand-800 transition-all group"
                    style={{ borderLeftColor: colors.solid.split(' ')[0] ? undefined : 'var(--accent)' }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1.5 ${colors.bg} ${colors.text}`}>
                          {course?.code || 'GEN'} · {exam.type.toUpperCase()}
                        </span>
                        <h3 className="text-base font-bold text-[--text-primary] truncate">
                          {exam.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <CountdownBadge targetDate={`${exam.date}T${exam.startTime}`} />
                        
                        {/* Edit/Delete */}
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditExam(exam.id)}
                            className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Exam"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="p-1.5 rounded-lg text-danger-500 hover:text-danger-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete Exam"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 text-xs text-[--text-secondary] bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-[--border]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="w-4 h-4 text-[--text-muted] shrink-0" />
                        <span className="truncate">{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Clock className="w-4 h-4 text-[--text-muted] shrink-0" />
                        <span className="truncate">{exam.startTime}–{exam.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-4 h-4 text-[--text-muted] shrink-0" />
                        <span className="truncate">{exam.location || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Weight and Topics */}
                    <div className="mt-4 space-y-2">
                      <div className="text-xs">
                        <span className="font-semibold text-[--text-secondary]">Grade Weight: </span>
                        <span className="font-bold text-brand-500">{exam.weight}% of final grade</span>
                      </div>
                      
                      {exam.topics.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-bold text-[--text-secondary] uppercase mr-1">Topics:</span>
                          {exam.topics.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-md font-medium text-[--text-primary]">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {exam.notes && (
                        <div className="text-xs bg-amber-50/45 dark:bg-yellow-950/10 border border-amber-100/50 dark:border-yellow-900/20 p-2.5 rounded-lg mt-2">
                          <span className="font-semibold text-amber-800 dark:text-yellow-400 block mb-0.5">Study Notes</span>
                          <p className="text-[11px] text-amber-900 dark:text-slate-300 leading-relaxed">{exam.notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Column */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[--text-secondary] tracking-tight border-b border-[--border] pb-2">
            Completed Exams ({pastExams.length})
          </h2>

          {pastExams.length === 0 ? (
            <div className="py-12 text-center text-xs text-[--text-secondary] border border-dashed border-[--border] rounded-2xl">
              No completed exams yet.
            </div>
          ) : (
            <div className="space-y-3 opacity-65 hover:opacity-100 transition-opacity">
              {pastExams.map(exam => {
                const course = data.courses[exam.courseId];

                return (
                  <Card
                    key={exam.id}
                    padding="sm"
                    className="flex items-center justify-between gap-4 hover:border-[--border] transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold text-[--text-secondary] block uppercase mb-0.5">
                        {course?.code || 'GEN'} · {exam.type.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-semibold text-[--text-primary] truncate line-through">
                        {exam.title}
                      </h4>
                      <p className="text-2xs text-[--text-secondary] mt-0.5">
                        {formatDate(exam.date)} at {exam.startTime} · {exam.weight}% weight
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-success-600 dark:text-success-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>

                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1.5 rounded-lg text-danger-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Exam Form Modal */}
      <ExamForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        examId={selectedExamId}
      />
    </div>
  );
};

export default ExamScheduler;
