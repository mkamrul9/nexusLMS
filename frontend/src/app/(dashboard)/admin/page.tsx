'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import toast from 'react-hot-toast';
import { Users, BookOpen, UserPlus, PlusSquare, ShieldCheck, GraduationCap, BookUser } from 'lucide-react';

type TabType = 'users' | 'courses' | 'create-user' | 'create-course';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('users');

  // Create User form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Student');
  const [creatingUser, setCreatingUser] = useState(false);

  // Create Course form state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [userRes, courseRes] = await Promise.all([
        api.get('/user'),
        api.get('/course')
      ]);
      setUsers(userRes.data);
      setCourses(courseRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      await api.post('/user', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
      toast.success(`${newUserRole} "${newUserName}" created successfully!`);
      setNewUserName(''); setNewUserEmail(''); setNewUserPassword(''); setNewUserRole('Student');
      setActiveTab('users');
      fetchAll();
    } catch (error: any) {
      console.error('Failed to create user', error);
      toast.error(error.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCourse(true);
    try {
      await api.post('/course', {
        name: newCourseName,
        subjectCode: newCourseCode,
        description: newCourseDesc
      });
      toast.success(`Course "${newCourseName}" created!`);
      setNewCourseName(''); setNewCourseCode(''); setNewCourseDesc('');
      setActiveTab('courses');
      fetchAll();
    } catch (error: any) {
      console.error('Failed to create course', error);
      toast.error(error.response?.data?.message || 'Failed to create course.');
    } finally {
      setCreatingCourse(false);
    }
  };

  const adminCount   = users.filter(u => u.role === 'Admin').length;
  const teacherCount = users.filter(u => u.role === 'Teacher').length;
  const studentCount = users.filter(u => u.role === 'Student').length;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'users',         label: 'Users',      icon: <Users className="w-4 h-4" /> },
    { id: 'courses',       label: 'Courses',    icon: <BookOpen className="w-4 h-4" /> },
    { id: 'create-user',   label: 'New User',   icon: <UserPlus className="w-4 h-4" /> },
    { id: 'create-course', label: 'New Course', icon: <PlusSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <div className="max-w-6xl mx-auto p-6 pt-8">

        {/* Header */}
        <div className="glass-panel p-8 mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 mb-6">Manage users, courses, and system settings.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Users',   value: users.length,   color: 'teal',   icon: <Users className="w-6 h-6" /> },
              { label: 'Admins',        value: adminCount,     color: 'red',    icon: <ShieldCheck className="w-6 h-6" /> },
              { label: 'Teachers',      value: teacherCount,   color: 'purple', icon: <GraduationCap className="w-6 h-6" /> },
              { label: 'Students',      value: studentCount,   color: 'blue',   icon: <BookUser className="w-6 h-6" /> },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="mb-2 flex justify-center text-slate-400">{stat.icon}</div>
                <div className={`text-2xl font-bold mb-0.5 ${
                  stat.color === 'teal'   ? 'text-teal-600' :
                  stat.color === 'red'    ? 'text-red-500'  :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-blue-600'
                }`}>{loading ? '–' : stat.value}</div>
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1.5 border border-white/70 w-fit shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* USERS TABLE */}
        {activeTab === 'users' && (
          <section className="glass-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                System Users
              </h2>
              <span className="text-sm text-slate-400 font-medium">{users.length} total</span>
            </div>
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/60 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-6 font-semibold">User</th>
                      <th className="py-3.5 px-6 font-semibold">Role</th>
                      <th className="py-3.5 px-6 font-semibold hidden sm:table-cell">User ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-teal-50/30 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {user.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={
                            user.role === 'Admin'   ? 'badge-danger'  :
                            user.role === 'Teacher' ? 'badge-info' :
                            'badge-teal'
                          }>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <span className="font-mono text-xs text-slate-300 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {user.id.substring(0, 18)}...
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* COURSES TABLE */}
        {activeTab === 'courses' && (
          <section className="glass-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Courses
              </h2>
              <span className="text-sm text-slate-400 font-medium">{courses.length} total</span>
            </div>
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {courses.length > 0 ? courses.map((course: any) => (
                  <div key={course.id} className="p-5 hover:bg-teal-50/20 transition flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-teal">{course.subjectCode}</span>
                        <h3 className="font-semibold text-slate-800">{course.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400">{course.description}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-300 ml-4 hidden sm:block">{course.id.substring(0, 12)}...</span>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-400 text-sm">No courses found. Create one using the "New Course" tab.</div>
                )}
              </div>
            )}
          </section>
        )}

        {/* CREATE USER FORM */}
        {activeTab === 'create-user' && (
          <div className="glass-card p-8 max-w-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              Create New User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                <input type="text" placeholder="e.g. Jane Doe" className="form-input" value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email *</label>
                <input type="email" placeholder="jane@school.edu" className="form-input" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Password *</label>
                <input type="password" placeholder="Minimum 8 characters" className="form-input" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Role *</label>
                <select className="form-input" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={creatingUser} className="btn-primary w-full flex justify-center items-center gap-2 h-11 mt-2">
                {creatingUser ? (
                  <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</>
                ) : 'Create User'}
              </button>
            </form>
          </div>
        )}

        {/* CREATE COURSE FORM */}
        {activeTab === 'create-course' && (
          <div className="glass-card p-8 max-w-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Create New Course
            </h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Course Name *</label>
                <input type="text" placeholder="e.g. Introduction to Computer Science" className="form-input" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Subject Code *</label>
                <input type="text" placeholder="e.g. CS101" className="form-input" value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea placeholder="Brief description of this course..." className="form-input resize-none" style={{ height: '80px' }} value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} />
              </div>
              <button type="submit" disabled={creatingCourse} className="btn-primary w-full flex justify-center items-center gap-2 h-11 mt-2">
                {creatingCourse ? (
                  <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</>
                ) : 'Create Course'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
