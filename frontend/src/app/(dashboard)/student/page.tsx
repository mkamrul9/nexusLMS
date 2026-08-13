'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Assignment } from '@/lib/types';
import StudentAssignmentCard from '@/components/StudentAssignmentCard';

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      // Note: Assuming a generic GET endpoint exists to fetch assignments
      const response = await api.get('/assignment'); 
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      <div className="grid gap-4">
        {assignments && assignments.length > 0 ? (
          assignments.map(assignment => (
            <StudentAssignmentCard key={assignment.id} assignment={assignment} />
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
}
