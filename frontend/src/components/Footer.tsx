import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">NexusLMS</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              A modern, role-based learning management system built for the future of education.
            </p>
            <div className="flex gap-3">
              {/* Social icons (placeholder) */}
              {[
                { title: 'GitHub', path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
              ].map(icon => (
                <a key={icon.title} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors" title={icon.title}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={icon.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Student Dashboard', href: '/student' },
                { label: 'Teacher Workspace', href: '/teacher' },
                { label: 'Admin Dashboard',   href: '/admin' },
                { label: 'Sign In',           href: '/login' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2.5">
              {[
                'Assignment Management',
                'Submission Tracking',
                'Grading & Feedback',
                'User Management',
                'Course Management',
              ].map(f => (
                <li key={f} className="text-sm text-slate-400 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Demo Access */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Demo</h3>
            <p className="text-sm text-slate-400 mb-4">Try NexusLMS instantly with demo accounts:</p>
            <div className="space-y-2">
              {[
                { role: 'Student',  email: 'student@demo.com', color: 'teal'   },
                { role: 'Teacher',  email: 'teacher@demo.com', color: 'purple' },
                { role: 'Admin',    email: 'admin@demo.com',   color: 'red'    },
              ].map(d => (
                <Link key={d.role} href="/login" className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    d.color === 'teal' ? 'bg-teal-400' : d.color === 'purple' ? 'bg-purple-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-xs font-semibold text-white">{d.role}</p>
                    <p className="text-xs text-slate-500">{d.email}</p>
                  </div>
                </Link>
              ))}
              <p className="text-xs text-slate-500 mt-1">Password: <span className="font-mono text-slate-400">Password123!</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} NexusLMS. Built with Next.js & ASP.NET Core.
          </p>
          <p className="text-xs text-slate-500">
            Assignment Submission System — v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
