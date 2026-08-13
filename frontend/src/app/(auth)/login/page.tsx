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

      // Set cookies for middleware
      document.cookie = `token=${token}; path=/`;
      document.cookie = `role=${userRole}; path=/`;

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
    <div className="flex-1 w-full bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center py-12">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <form onSubmit={handleLogin} className="z-10 relative p-10 bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
            Sign In
          </button>
        </div>

        {/* Demo Credentials Section */}
        <div className="mt-8 pt-6 border-t border-gray-200/60">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => { setEmail('admin@demo.com'); setPassword('Password123!'); }}
              className="px-2 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Admin
            </button>
            <button 
              type="button"
              onClick={() => { setEmail('teacher@demo.com'); setPassword('Password123!'); }}
              className="px-2 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Teacher
            </button>
            <button 
              type="button"
              onClick={() => { setEmail('student@demo.com'); setPassword('Password123!'); }}
              className="px-2 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Student
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
