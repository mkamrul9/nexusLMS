import { useState } from 'react';
import api from '@/lib/api';
import { Assignment } from '@/lib/types';

export default function StudentAssignmentCard({ assignment }: { assignment: Assignment }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPastDeadline = new Date() > new Date(assignment.deadline);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/submission', {
        assignmentId: assignment.id,
        answerContent: answer
      });
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm mb-4 bg-white">
      <h3 className="font-bold text-lg">{assignment.title}</h3>
      <p className="text-gray-600 mb-2">{assignment.description}</p>
      <p className={`text-sm mb-4 font-semibold ${isPastDeadline ? 'text-red-600' : 'text-green-600'}`}>
        Deadline: {new Date(assignment.deadline).toLocaleString()}
      </p>
      
      {!isPastDeadline ? (
        <div className="mt-4">
          <textarea 
            className="w-full p-2 border rounded mb-2" 
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !answer}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      ) : (
        <div className="p-3 bg-gray-100 text-gray-500 rounded text-center">
          The deadline for this assignment has passed.
        </div>
      )}
    </div>
  );
}
