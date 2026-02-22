import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
            TaskTracker
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-16 md:pt-32 md:pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Simple. Fast. Organized.
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
          Manage your tasks
          <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
            with clarity
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A clean, minimal task tracker to help you stay focused and get things done. 
          Organize, prioritize, and track your progress — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            Start for Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all active:scale-[0.98]"
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 md:px-12 pb-20 md:pb-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Create Tasks</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Quickly add tasks with titles, descriptions, due dates, and status. Stay on top of everything that matters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Track Progress</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Move tasks through To Do, In Progress, and Done. One-click status updates keep your workflow smooth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Search & Filter</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find tasks instantly with real-time search, filter by status, and sort by date or priority.
            </p>
          </div>
        </div>
      </section>

      {/* Status Workflow Section */}
      <section className="px-6 md:px-12 pb-20 md:pb-32 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Simple workflow, powerful results
        </h2>
        <p className="text-slate-500 mb-12 max-w-xl mx-auto">
          Move tasks through a clean three-stage pipeline with a single click.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {/* To Do */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="font-semibold text-slate-700">To Do</span>
          </div>
          <div className="hidden sm:block text-slate-300 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="block sm:hidden text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          {/* In Progress */}
          <div className="flex items-center gap-3 bg-white border border-blue-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="font-semibold text-blue-700">In Progress</span>
          </div>
          <div className="hidden sm:block text-slate-300 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="block sm:hidden text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          {/* Done */}
          <div className="flex items-center gap-3 bg-white border border-emerald-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="font-semibold text-emerald-700">Done</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 pb-20 md:pb-32 max-w-4xl mx-auto">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center shadow-xl shadow-blue-500/15">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to get organized?
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Create your free account and start managing your tasks in seconds.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-base font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 shadow-lg transition-all active:scale-[0.98]"
          >
            Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">TaskTracker</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} CyberDog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
