'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ClipboardList, GraduationCap, Settings, Key, BookOpen } from 'lucide-react';

/**
 * Reads the value of a named cookie from document.cookie.
 * Returns null during SSR (when document is not available) or if the cookie is not set.
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const roleNavLinks: Record<string, { label: string; href: string; icon: React.ReactNode }[]> = {
  Student: [
    { label: 'My Assignments', href: '/student', icon: <ClipboardList className="w-4 h-4" /> },
  ],
  Teacher: [
    { label: 'Workspace',    href: '/teacher', icon: <GraduationCap className="w-4 h-4" /> },
  ],
  Admin: [
    { label: 'Dashboard',   href: '/admin', icon: <Settings className="w-4 h-4" /> },
  ],
};

/**
 * Top navigation bar rendered on every page.
 * Reads the user's role and auth state from localStorage (token) and cookies (role, userName).
 * Updates automatically on route changes via the `pathname` dependency in useEffect.
 * Provides role-specific nav links, a user avatar dropdown, and a mobile hamburger menu.
 */
export default function Navbar() {
  const [token, setToken]           = useState<string | null>(null);
  const [role, setRole]             = useState<string | null>(null);
  const [userName, setUserName]     = useState<string>('');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t    = localStorage.getItem('token');
    const r    = getCookie('role');
    const name = getCookie('userName') || '';
    setToken(t);
    setRole(r);
    setUserName(name);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    document.cookie = 'userName=; Max-Age=0; path=/;';
    setToken(null);
    setRole(null);
    setMenuOpen(false);
    router.push('/login');
  };

  const navLinks = role ? (roleNavLinks[role] || []) : [];
  const initials = userName ? userName.substring(0, 2).toUpperCase() : role?.substring(0, 2).toUpperCase() || 'U';

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href={token ? (role === 'Admin' ? '/admin' : role === 'Teacher' ? '/teacher' : '/student') : '/'} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-teal-500/40 transition-shadow">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-gradient hidden sm:block">NexusLMS</span>
            </Link>

            {/* Desktop nav links */}
            {token && navLinks.length > 0 && (
              <div className="hidden md:flex items-center gap-1 ml-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive(link.href)
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {token ? (
              <>
                {/* Role badge */}
                {role && (
                  <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    role === 'Admin'   ? 'bg-red-50 text-red-600 border border-red-200' :
                    role === 'Teacher' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                    'bg-teal-50 text-teal-600 border border-teal-200'
                  }`}>
                    {role === 'Admin' ? <Key className="w-3.5 h-3.5" /> : role === 'Teacher' ? <GraduationCap className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />} {role}
                  </span>
                )}

                {/* User avatar dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(v => !v)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                  >
                    {initials}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{userName || role}</p>
                      </div>
                      <div className="py-1">
                        {navLinks.map(link => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <span>{link.icon}</span> {link.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  onClick={() => setMobileOpen(v => !v)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary px-5 py-2 text-sm"
              >
                Sign In →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && token && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.href) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
