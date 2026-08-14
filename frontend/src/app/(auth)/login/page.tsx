'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { Key, GraduationCap, BookOpen, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userEmail = decoded.sub || decoded.email || '';
      const displayName = userEmail.split('@')[0] || userRole;

      const normalizedRole = userRole?.toLowerCase() || '';

      document.cookie = `token=${token}; path=/`;
      document.cookie = `role=${userRole}; path=/`;
      document.cookie = `userName=${encodeURIComponent(displayName)}; path=/`;

      toast.success(`Welcome back! Logged in as ${userRole}.`);

      // Add a slight delay to ensure cookies are persisted before navigation
      setTimeout(() => {
        if (normalizedRole === 'admin') window.location.href = '/admin';
        else if (normalizedRole === 'teacher') window.location.href = '/teacher';
        else if (normalizedRole === 'student') window.location.href = '/student';
        else window.location.href = '/';
      }, 200);
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'teacher' | 'student') => {
    const credentials = {
      admin:   { email: 'admin@demo.com',   password: 'Password123!' },
      teacher: { email: 'teacher@demo.com', password: 'Password123!' },
      student: { email: 'student@demo.com', password: 'Password123!' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    toast(`Filled ${role} credentials. Click Sign In.`, { icon: <User className="w-4 h-4 text-teal-600" /> });
  };

  return (
    <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-center items-center py-12">
      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
      <div className="absolute bottom-[-15%] right-[-10%] w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] left-[40%] w-60 h-60 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <form onSubmit={handleLogin} className="z-10 relative p-9 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-gradient">NexusLMS</span>
        </div>

        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@school.edu"
              className="form-input"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-12 flex justify-center items-center gap-2 text-base mt-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In →'}
          </button>
        </div>

        {/* Demo credentials */}
        <div className="mt-7 pt-6 border-t border-slate-100">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 border border-red-100 transition active:scale-95"
            ><Key className="w-3.5 h-3.5" /> Admin</button>
            <button
              type="button"
              onClick={() => fillDemo('teacher')}
              className="py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 border border-purple-100 transition active:scale-95"
            ><GraduationCap className="w-3.5 h-3.5" /> Teacher</button>
            <button
              type="button"
              onClick={() => fillDemo('student')}
              className="py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-600 bg-teal-50 rounded-xl hover:bg-teal-100 border border-teal-100 transition active:scale-95"
            ><BookOpen className="w-3.5 h-3.5" /> Student</button>
          </div>
        </div>
      </form>
    </div>
  );
}

