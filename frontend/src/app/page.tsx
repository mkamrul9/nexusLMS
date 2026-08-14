import Link from 'next/link';
import { BookOpen, GraduationCap, Settings, Users, CheckCircle, Lock, Zap, Key, ClipboardList, TrendingUp, Rocket, BookUser, ShieldCheck, GraduationCap as TeacherIcon } from 'lucide-react';

const features = [
  {
    role: 'Students',
    icon: <BookOpen className="w-7 h-7 text-white" />,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-400',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    items: [
      'View all published assignments',
      'Submit answers directly in-browser',
      'Track your submission history',
      'View grades & teacher feedback',
      'Deadline countdowns at a glance',
    ],
    href: '/student',
    cta: 'View Student Portal',
  },
  {
    role: 'Teachers',
    icon: <TeacherIcon className="w-7 h-7 text-white" />,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-400',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    items: [
      'Create & manage assignments',
      'Save as draft or publish instantly',
      'Review all student submissions',
      'Grade and provide written feedback',
      'Track graded vs pending work',
    ],
    href: '/teacher',
    cta: 'View Teacher Workspace',
  },
  {
    role: 'Administrators',
    icon: <Settings className="w-7 h-7 text-white" />,
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    items: [
      'Full user management (add/view)',
      'Create and manage courses',
      'Assign teachers to courses',
      'Monitor system-wide statistics',
      'Role-based access control',
    ],
    href: '/admin',
    cta: 'View Admin Dashboard',
  },
];

const stats = [
  { value: '3',    label: 'User Roles',        icon: <Users className="w-8 h-8" /> },
  { value: '100%', label: 'Feature Coverage',  icon: <CheckCircle className="w-8 h-8" /> },
  { value: 'JWT',  label: 'Secure Auth',       icon: <Lock className="w-8 h-8" /> },
  { value: 'Live', label: 'Real-time Grading', icon: <Zap className="w-8 h-8" /> },
];

const steps = [
  { step: '01', title: 'Sign In', desc: 'Use your role-specific credentials to access your personalised dashboard.', icon: <Key className="w-8 h-8" /> },
  { step: '02', title: 'Take Action', desc: 'Students submit work, teachers create and grade, admins manage the system.', icon: <ClipboardList className="w-8 h-8" /> },
  { step: '03', title: 'Track Progress', desc: 'View real-time feedback, grades, and submission statuses instantly.', icon: <TrendingUp className="w-8 h-8" /> },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwdjQwaDQwVjBIMHptMSAxaDM4djM4SDFWMXN6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Role-Based Learning Management System
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Learning Made{' '}
            <span className="text-gradient">Seamless</span>
            <br />
            <span className="text-slate-700 text-4xl sm:text-5xl md:text-6xl font-bold">& Powerful</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            NexusLMS brings students, teachers, and admins onto one unified platform.
            Submit assignments, grade work, and manage courses — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur text-slate-700 font-semibold rounded-2xl border border-slate-200 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 text-base"
            >
              Explore Features
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Demo pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Try with demo accounts:</span>
            {[
              { label: 'Student', icon: <BookUser className="w-3.5 h-3.5" />, color: 'teal'   },
              { label: 'Teacher', icon: <TeacherIcon className="w-3.5 h-3.5" />, color: 'purple' },
              { label: 'Admin',   icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'red'    },
            ].map(d => (
              <Link key={d.label} href="/login" className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border transition-colors ${
                d.color === 'teal'   ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100' :
                d.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' :
                'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}>{d.icon}{d.label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────── */}
      <section className="bg-slate-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="mb-2 flex justify-center text-teal-400">{s.icon}</div>
                <div className="text-2xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-teal-600 text-sm font-bold uppercase tracking-wider">Role-Based Access</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">Built for Every Role</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Each user type gets a tailored experience — from students submitting work to admins managing the entire system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.role} className={`glass-card p-8 flex flex-col border ${f.borderColor} relative overflow-hidden group`}>
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient}`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  {f.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">For {f.role}</h3>

                <ul className="space-y-2.5 flex-grow mb-6">
                  {f.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className={`w-4 h-4 mt-0.5 shrink-0 ${f.textColor}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={f.href}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${f.textColor} hover:gap-2.5 transition-all`}
                >
                  {f.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-teal-600 text-sm font-bold uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Get started in minutes. No complicated setup.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />

            {steps.map((s, i) => (
              <div key={s.step} className="glass-card p-8 text-center relative">
                {/* Step number */}
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mx-auto">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-panel p-12 text-center overflow-hidden border border-teal-100">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-white to-blue-50/80" />
            <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-teal-200 rounded-full filter blur-3xl opacity-20" />
            <div className="absolute bottom-[-30%] left-[-10%] w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20" />

            <div className="relative z-10">
              <div className="mb-5 flex justify-center"><Rocket className="w-12 h-12 text-teal-500" /></div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
                Log in with any demo account to explore the full platform right now. No registration needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
                >
                  Enter the Platform
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-5">
                Demo: <span className="font-mono">student@demo.com</span> / <span className="font-mono">teacher@demo.com</span> / <span className="font-mono">admin@demo.com</span> — all with <span className="font-mono">Password123!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
