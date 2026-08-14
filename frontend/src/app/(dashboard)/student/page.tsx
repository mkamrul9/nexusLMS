'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Assignment, Submission } from '@/lib/types';
import StudentAssignmentCard from '@/components/StudentAssignmentCard';
import toast from 'react-hot-toast';
import { ClipboardList, FileText } from 'lucide-react';

interface SubmissionWithAssignment extends Submission {
  assignmentTitle?: string;
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [mySubmissions, setMySubmissions] = useState<SubmissionWithAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [assignRes, subRes] = await Promise.all([
        api.get('/assignment'),
        api.get('/submission/my-submissions')
      ]);

      const published = assignRes.data.filter((a: Assignment) => a.isPublished);
      setAssignments(published);

      // Enrich submissions with assignment titles
      const assignMap: Record<string, string> = {};
      assignRes.data.forEach((a: Assignment) => { assignMap[a.id] = a.title; });
      const enriched = subRes.data.map((s: Submission) => ({
        ...s,
        assignmentTitle: assignMap[s.assignmentId] || 'Unknown Assignment'
      }));
      setMySubmissions(enriched);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = assignments.filter(a => new Date() < new Date(a.deadline)).length;
  const submittedCount = mySubmissions.length;
  const gradedCount = mySubmissions.filter(s => s.status === 'Graded').length;

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <div className="max-w-6xl mx-auto p-6 pt-8">

        {/* Hero Header */}
        <div className="glass-panel p-8 mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Student Dashboard</h1>
          <p className="text-slate-500">Track your assignments, submit work, and review your grades.</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Open Assignments', value: pendingCount, color: 'teal' },
              { label: 'Submitted', value: submittedCount, color: 'blue' },
              { label: 'Graded', value: gradedCount, color: 'purple' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  stat.color === 'teal' ? 'text-teal-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                }`}>{loading ? '–' : stat.value}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1.5 border border-white/70 w-fit shadow-sm">
          {(['assignments', 'submissions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              {tab === 'assignments' ? <ClipboardList className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              {tab === 'assignments' ? 'Assignments' : 'My Submissions'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            <p className="text-slate-400 text-sm">Loading your dashboard...</p>
          </div>
        ) : activeTab === 'assignments' ? (
          <div className="grid gap-6 md:grid-cols-2">
            {assignments.length > 0 ? (
              assignments.map(assignment => (
                <StudentAssignmentCard key={assignment.id} assignment={assignment} onSubmitSuccess={fetchAll} />
              ))
            ) : (
              <div className="col-span-full glass-panel p-16 text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-xl font-medium mb-2">No assignments available</p>
                <p className="text-sm">Check back later or contact your teacher.</p>
              </div>
            )}
          </div>
        ) : (
          /* My Submissions Tab */
          <div className="space-y-4">
            {mySubmissions.length > 0 ? mySubmissions.map(sub => (
              <div key={sub.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{sub.assignmentTitle}</h3>
                    <p className="text-sm text-slate-500">
                      Submitted: {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={sub.status === 'Graded' ? 'badge-success' : 'badge-info'}>
                    {sub.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Your Answer</p>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{sub.answerContent}</p>
                </div>

                {sub.status === 'Graded' && (
                  <div className="flex gap-4">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex-1 text-center">
                      <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Marks Awarded</p>
                      <p className="text-2xl font-bold text-teal-700">{sub.marksAwarded ?? '–'}</p>
                    </div>
                    {sub.feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-3 flex-1">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Teacher Feedback</p>
                        <p className="text-slate-700 text-sm">{sub.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )) : (
              <div className="glass-panel p-16 text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl font-medium mb-2">No submissions yet</p>
                <p className="text-sm">Submit your first assignment to see it here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
