'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { Submission, SubmissionStatus } from '@/lib/types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, ClipboardList, FileText } from 'lucide-react';

/**
 * Grading page for a specific assignment.
 * Displays all student submissions and allows the teacher to enter marks and feedback.
 *
 * Route: /teacher/assignments/[id]
 */
export default function GradingPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise — required in Next.js 15+ App Router
  const { id } = use(params);

  const [submissions, setSubmissions]     = useState<Submission[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [marks, setMarks]                 = useState<Record<string, number>>({});
  const [feedback, setFeedback]           = useState<Record<string, string>>({});
  const [loading, setLoading]             = useState(true);
  const [grading, setGrading]             = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch submissions for this assignment and the assignment details in parallel
        const [subRes, assignRes] = await Promise.all([
          api.get(`/submission/assignment/${id}`),
          api.get(`/assignment/${id}`)
        ]);
        setSubmissions(subRes.data);
        setAssignmentTitle(assignRes.data?.title || 'Assignment');

        // Pre-fill the marks and feedback inputs with any existing graded values
        const initialMarks: Record<string, number>   = {};
        const initialFeedback: Record<string, string> = {};
        subRes.data.forEach((s: Submission) => {
          if (s.marksAwarded !== undefined && s.marksAwarded !== null) {
            initialMarks[s.id] = s.marksAwarded;
          }
          if (s.feedback) {
            initialFeedback[s.id] = s.feedback;
          }
        });
        setMarks(initialMarks);
        setFeedback(initialFeedback);
      } catch (error) {
        console.error('Failed to fetch submission data:', error);
        toast.error('Failed to load submissions. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /**
   * Saves the grade (marks + feedback) for a single submission.
   * Optimistically updates the local state on success to avoid a full refetch.
   */
  const handleGrade = async (submissionId: string) => {
    if (marks[submissionId] === undefined || marks[submissionId] === null) {
      toast.error('Please enter a marks value before saving.');
      return;
    }
    setGrading(prev => ({ ...prev, [submissionId]: true }));
    try {
      await api.put(`/submission/${submissionId}/grade`, {
        marks:    marks[submissionId],
        feedback: feedback[submissionId] || '',
        status:   SubmissionStatus.Graded
      });

      // Optimistic UI update — no need to refetch the full list
      setSubmissions(prev => prev.map(s =>
        s.id === submissionId
          ? { ...s, marksAwarded: marks[submissionId], feedback: feedback[submissionId] || '', status: SubmissionStatus.Graded }
          : s
      ));
      toast.success('Grade saved successfully!');
    } catch (error: any) {
      console.error('Grading failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save grade. Please try again.');
    } finally {
      setGrading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  // Summary counts for the header badges
  const gradedCount  = submissions.filter(s => s.status === SubmissionStatus.Graded).length;
  const pendingCount = submissions.filter(s => s.status !== SubmissionStatus.Graded).length;

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <div className="max-w-5xl mx-auto p-6 pt-8">

        {/* ── Back Navigation ─────────────────────────────────── */}
        <div className="mb-5">
          <Link href="/teacher" className="text-teal-600 hover:text-teal-700 flex items-center gap-1.5 text-sm font-medium transition group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="glass-panel p-7 mb-7">
          <h1 className="text-3xl font-bold text-gradient mb-1">
            {assignmentTitle || 'Review Submissions'}
          </h1>
          <p className="text-slate-500 text-sm mb-5">Grade student answers and provide feedback below.</p>
          {!loading && (
            <div className="flex gap-3 flex-wrap">
              <span className="badge-teal flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {gradedCount} Graded</span>
              <span className="badge-info flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pendingCount} Pending</span>
              <span className="badge-warning flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> {submissions.length} Total</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            <p className="text-slate-400 text-sm">Loading submissions...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {submissions.length > 0 ? submissions.map((sub, index) => (
              <div key={sub.id} className="glass-card p-6 overflow-hidden">

                {/* ── Submission Header ──────────────────────── */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/*
                     * Avatar uses the submission index (1, 2, 3…) rather than UUID characters
                     * because a UUID's first chars are always "00" from the seed data, which is meaningless.
                     */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Student <span className="font-mono text-xs text-slate-500">{sub.studentId.substring(0, 8)}...</span></p>
                      <p className="text-xs text-slate-400">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={sub.status === SubmissionStatus.Graded ? 'badge-teal' : 'badge-info'}>
                    {sub.status}
                  </span>
                </div>

                {/* ── Student's Answer ───────────────────────── */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student's Answer</p>
                  <div className="p-4 bg-slate-50/70 rounded-xl text-slate-700 text-sm whitespace-pre-wrap border border-slate-100 min-h-16 leading-relaxed">
                    {sub.answerContent}
                  </div>
                </div>

                {/* ── Grading Section ────────────────────────── */}
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/60">
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3">
                    {sub.status === SubmissionStatus.Graded
                      ? <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Graded — Update below</span>
                      : <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Enter Grade</span>}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-28">
                      <label className="block text-xs text-slate-500 mb-1.5 font-medium">Marks</label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        defaultValue={sub.marksAwarded ?? ''}
                        placeholder="0"
                        className="form-input text-center font-bold"
                        onChange={e => setMarks({ ...marks, [sub.id]: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1.5 font-medium">Feedback (optional)</label>
                      <input
                        type="text"
                        defaultValue={sub.feedback || ''}
                        placeholder="Great work on..."
                        className="form-input"
                        onChange={e => setFeedback({ ...feedback, [sub.id]: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => handleGrade(sub.id)}
                        disabled={grading[sub.id]}
                        className="btn-primary h-10 flex justify-center items-center gap-2 px-5 w-full sm:w-auto"
                      >
                        {grading[sub.id] ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : sub.status === SubmissionStatus.Graded ? 'Update Grade' : 'Save Grade'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )) : (
              <div className="glass-panel p-20 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl text-slate-500 font-medium mb-2">No submissions yet</p>
                <p className="text-sm text-slate-400">Students haven't submitted their answers for this assignment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
