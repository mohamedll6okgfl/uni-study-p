import React, { useState } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import { usePlannerData } from '../../context/PlannerContext';
import CourseCard from './CourseCard';
import CourseForm from '../../components/forms/CourseForm';
import CourseDetailPanel from './CourseDetailPanel';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export const Courses: React.FC = () => {
  const { data, dispatch } = usePlannerData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourseIdForForm, setSelectedCourseIdForForm] = useState<string | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCourseIdForDetail, setSelectedCourseIdForDetail] = useState<string | null>(null);

  const activeCourses = Object.values(data.courses).filter(c => !c.isArchived);

  const handleAddCourse = () => {
    setSelectedCourseIdForForm(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseIdForForm(courseId);
    setIsFormOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    dispatch({
      type: 'DELETE_COURSE',
      payload: { id: courseId },
    });
  };

  const handleOpenDetail = (courseId: string) => {
    setSelectedCourseIdForDetail(courseId);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--text-primary]">
            My Courses
          </h1>
          <p className="text-xs text-[--text-secondary] mt-0.5">
            Manage your courses, schedules, credits, and academic performance.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddCourse}
        >
          Add Course
        </Button>
      </div>

      {/* Courses Grid */}
      {activeCourses.length === 0 ? (
        <Card className="py-12 border-dashed">
          <EmptyState
            icon={<GraduationCap className="w-12 h-12 text-brand-500" />}
            title="No courses added yet"
            description="Add your classes to start tracking assignments, exams, and notes."
            action={{
              label: 'Add First Course',
              onClick: handleAddCourse,
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => handleOpenDetail(course.id)}
              onEdit={() => handleEditCourse(course.id)}
              onDelete={() => handleDeleteCourse(course.id)}
            />
          ))}
        </div>
      )}

      {/* Course Form Modal */}
      <CourseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        courseId={selectedCourseIdForForm}
      />

      {/* Course Detail slide-over / Modal */}
      <CourseDetailPanel
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        courseId={selectedCourseIdForDetail}
      />
    </div>
  );
};

export default Courses;
import Card from '../../components/ui/Card';
