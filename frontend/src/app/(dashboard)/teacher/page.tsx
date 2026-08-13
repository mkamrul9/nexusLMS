'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function TeacherDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [courseId, setCourseId] = useState(''); // Would typically be selected from a dropdown of fetched courses

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(deadline);

    if (selectedDate <= currentDate) {
      alert('Deadline must be a future date.');
      return; // Stop execution
    }

    if (maxMarks < 1 || maxMarks > 1000) {
      alert('Maximum marks must be between 1 and 1000.');
      return;
    }

    try {
      await api.post('/assignment', {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        maximumMarks: maxMarks,
        courseId
      });
      alert('Assignment drafted successfully!');
      // Refresh the assignment list here
    } catch (error) {
      console.error('Failed to create assignment', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Workspace</h1>
      
      <section className="bg-white p-6 rounded shadow max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <input 
            type="text" placeholder="Assignment Title" className="w-full p-2 border rounded"
            value={title} onChange={e => setTitle(e.target.value)} required 
          />
          <textarea 
            placeholder="Detailed Description" className="w-full p-2 border rounded"
            value={description} onChange={e => setDescription(e.target.value)} required 
          />
          <div className="flex gap-4">
            <input 
              type="datetime-local" className="w-full p-2 border rounded"
              value={deadline} onChange={e => setDeadline(e.target.value)} required 
            />
            <input 
              type="number" placeholder="Max Marks" className="w-full p-2 border rounded"
              value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))} required 
            />
          </div>
          <input 
            type="text" placeholder="Course ID (UUID)" className="w-full p-2 border rounded"
            value={courseId} onChange={e => setCourseId(e.target.value)} required 
          />
          {/* Note: Course selection dropdown would go here */}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Save as Draft
          </button>
        </form>
      </section>
    </div>
  );
}
