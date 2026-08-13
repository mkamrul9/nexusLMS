'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Submission } from '@/lib/types';

// Assuming assignmentId is passed via params
export default function GradingPage({ params }: { params: { id: string } }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch submissions for this specific assignment
    api.get(`/submission/assignment/${params.id}`).then(res => setSubmissions(res.data));
  }, [params.id]);

  const handleGrade = async (submissionId: string) => {
    try {
      await api.put(`/submission/${submissionId}/grade`, {
        marks: marks[submissionId] || 0,
        feedback: feedback[submissionId] || '',
        status: 'Graded'
      });
      alert('Grade saved!');
    } catch (error) {
      console.error('Grading failed', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Review Submissions</h1>
      {submissions && submissions.length > 0 ? submissions.map(sub => (
        <div key={sub.id} className="bg-white p-4 border rounded shadow-sm mb-4">
          <p className="font-semibold mb-2">Student Answer:</p>
          <div className="p-3 bg-gray-50 rounded mb-4">{sub.answerContent}</div>
          
          <div className="flex gap-4">
            <input 
              type="number" placeholder="Marks" className="border p-2 rounded w-24"
              onChange={e => setMarks({...marks, [sub.id]: Number(e.target.value)})}
            />
            <input 
              type="text" placeholder="Feedback..." className="border p-2 rounded flex-1"
              onChange={e => setFeedback({...feedback, [sub.id]: e.target.value})}
            />
            <button 
              onClick={() => handleGrade(sub.id)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit Grade
            </button>
          </div>
        </div>
      )) : (
        <p>No submissions found for this assignment.</p>
      )}
    </div>
  );
}
