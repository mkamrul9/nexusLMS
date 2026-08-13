'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">System Users</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-800' : 
                    user.role === 'Teacher' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* Additional sections for Course Management and Assigning Teachers would go here */}
    </div>
  );
}
