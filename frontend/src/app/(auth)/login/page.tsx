'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login', { email, password });
      const { token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Decode token to find the role and route accordingly
      const decoded: any = jwtDecode(token);
      
      // The claim name might be different depending on how .NET generated it.
      // E.g. 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      const userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (userRole === 'Admin') router.push('/admin');
      else if (userRole === 'Teacher') router.push('/teacher');
      else if (userRole === 'Student') router.push('/student');
      else router.push('/dashboard');
      
    } catch (error) {
      console.error('Login failed', error);
      // Handle UI error state here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">System Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-4 border rounded"
          value={email} onChange={e => setEmail(e.target.value)} required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 border rounded"
          value={password} onChange={e => setPassword(e.target.value)} required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}
