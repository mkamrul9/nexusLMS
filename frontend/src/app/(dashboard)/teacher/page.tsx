'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Assignment } from '@/lib/types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Calendar, Target, Rocket } from 'lucide-react';

export default function TeacherDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [courseId, setCourseId] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignRes, coursesRes] = await Promise.all([
        api.get('/assignment'),
        api.get('/course')
      ]);
      setAssignments(assignRes.data);
      setCourses(coursesRes.data);
      if (!courseId && coursesRes.data.length > 0) {
        setCourseId(coursesRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignment');
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDate = new Date(deadline);
    if (selectedDate <= new Date()) {
      toast.error('Deadline must be a future date and time.');
      return;
    }
    if (maxMarks < 1 || maxMarks > 1000) {
      toast.error('Maximum marks must be between 1 and 1000.');
      return;
    }
    if (!courseId) {
      toast.error('Please select a course.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/assignment', {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        maximumMarks: maxMarks,
        courseId
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      setMaxMarks(100);
      toast.success('Assignment created as draft!');
      fetchAssignments();
    } catch (error: any) {
      console.error('Failed to create assignment', error);
      toast.error(error.response?.data?.message || 'Failed to create assignment. Check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (assignmentId: string) => {
    try {
      await api.post(`/assignment/${assignmentId}/publish`);
      toast.success('Assignment published! Students can now see it.');
      fetchAssignments();
    } catch (error: any) {
      console.error('Failed to publish assignment', error);
      toast.error(error.response?.data?.message || 'Failed to publish assignment.');
    }
  };

  const publishedCount = assignments.filter(a => a.isPublished).length;
  const draftCount = assignments.filter(a => !a.isPublished).length;

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <div className="max-w-7xl mx-auto p-6 pt-8">

        {/* Header */}
        <div className="glass-panel p-8 mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Teacher Workspace</h1>
          <p className="text-slate-500">Create and manage assignments. Review and grade student submissions.</p>
          <div className="flex gap-4 mt-5">
            <div className="glass-card px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-teal-600">{publishedCount}</p>
                <p className="text-xs text-slate-500">Published</p>
              </div>
            </div>
            <div className="glass-card px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-600">{draftCount}</p>
                <p className="text-xs text-slate-500">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create Assignment Form */}
          <div className="lg:col-span-1">
            <section className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Create Assignment
              </h2>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Title *</label>
                  <input
                    type="text" placeholder="e.g. Midterm Project"
                    className="form-input"
                    value={title} onChange={e => setTitle(e.target.value)} required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description *</label>
                  <textarea
                    placeholder="Provide detailed instructions..."
                    className="form-input resize-none"
                    style={{ height: '80px' }}
                    value={description} onChange={e => setDescription(e.target.value)} required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Deadline *</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={deadline} onChange={e => setDeadline(e.target.value)} required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Max Marks *</label>
                    <input
                      type="number" min="1" max="1000"
                      className="form-input"
                      value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))} required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Course *</label>
                  <select
                    className="form-input"
                    value={courseId} onChange={e => setCourseId(e.target.value)} required
                  >
                    <option value="" disabled>Select a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.subjectCode} — {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex justify-center items-center gap-2 h-11 mt-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Save as Draft'}
                </button>
              </form>
            </section>
          </div>

          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-700 px-1">Your Assignments</h2>

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : assignments.length > 0 ? (
              assignments.map(assignment => (
                <div key={assignment.id} className="glass-card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                      <span className={assignment.isPublished ? 'badge-teal' : 'badge-warning'}>
                        {assignment.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(assignment.deadline).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {assignment.maximumMarks} pts</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                    {!assignment.isPublished && (
                      <button
                        onClick={() => handlePublish(assignment.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-lg transition active:scale-95"
                      >
                        <Rocket className="w-4 h-4" /> Publish
                      </button>
                    )}
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="flex-1 sm:flex-none text-center text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-lg transition active:scale-95"
                    >
                      View Submissions
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-16 text-center text-slate-400">
                <svg className="w-14 h-14 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium mb-1">No assignments yet</p>
                <p className="text-sm">Use the form to create your first assignment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
