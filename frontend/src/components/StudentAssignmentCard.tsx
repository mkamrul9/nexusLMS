'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Assignment } from '@/lib/types';
import toast from 'react-hot-toast';

export default function StudentAssignmentCard({
  assignment,
  onSubmitSuccess
}: {
  assignment: Assignment;
  onSubmitSuccess?: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isPastDeadline = new Date() > new Date(assignment.deadline);
  const deadlineDate = new Date(assignment.deadline);
  const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Please write your answer before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/submission', {
        assignmentId: assignment.id,
        answerContent: answer.trim()
      });
      setSubmitted(true);
      toast.success('🎉 Assignment submitted successfully!');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error: any) {
      console.error('Submission failed', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden group">
      {/* Teal accent left border */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-teal-600 group-hover:w-1.5 transition-all duration-300 rounded-l-xl" />

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-slate-800 leading-tight pr-2">{assignment.title}</h3>
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
          isPastDeadline ? 'badge-danger' : 'badge-teal'
        }`}>
          {isPastDeadline ? 'Closed' : 'Open'}
        </span>
      </div>

      <p className="text-slate-500 text-sm mb-4 leading-relaxed flex-grow">{assignment.description}</p>

      <div className="flex items-center justify-between text-xs text-slate-400 mb-5 pb-4 border-b border-slate-100">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Due: {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {assignment.maximumMarks} pts
        </span>
        {!isPastDeadline && (
          <span className={`font-semibold ${daysLeft <= 2 ? 'text-red-500' : 'text-teal-500'}`}>
            {daysLeft === 1 ? 'Due tomorrow' : `${daysLeft} days left`}
          </span>
        )}
      </div>

      {submitted ? (
        <div className="mt-auto p-4 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl flex items-center gap-3 font-medium text-sm">
          <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Submitted! Check My Submissions for grade.
        </div>
      ) : !isPastDeadline ? (
        <div className="mt-auto">
          <textarea
            className="w-full p-3 border-1.5 border-slate-200 rounded-xl mb-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition shadow-sm resize-none text-slate-700 text-sm bg-white/80 placeholder-slate-300"
            rows={4}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
            className="btn-primary w-full flex justify-center items-center gap-2 h-11"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Answer
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-auto p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-center text-sm font-medium">
          ⏰ Deadline has passed. Submission closed.
        </div>
      )}
    </div>
  );
}
