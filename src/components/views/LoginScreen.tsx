import React, { useState } from 'react';
import { useTaskFlow } from '../../context/TaskFlowContext';
import { Layers, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setCurrentUser, users, showToast } = useTaskFlow();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState(users[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill in both email and password', 'error');
      return;
    }
    
    // Simulate lookup
    const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
    } else {
      // Create user or fallback
      const demoUser = users[0];
      setCurrentUser(demoUser);
      showToast('Demo User Session started (Unrecognized email, logged in as Project Manager)', 'info');
    }
  };

  const handleDemoSignIn = () => {
    const matched = users.find(u => u.id === selectedDemoUser);
    if (matched) {
      setCurrentUser(matched);
      showToast(`Logged in as ${matched.name} (${matched.role})`, 'success');
    } else {
      setCurrentUser(users[0]);
      showToast(`Welcome back, ${users[0].name}`, 'success');
    }
  };

  return (
    <div id="login-screen" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4 py-12 transition-colors duration-200">
      <div className="absolute inset-0 bg-radial-gradient from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        {/* Visual Brand Card */}
        <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[32px] p-8 transition-colors duration-200">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              TaskFlow<span className="text-indigo-600">.ai</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
              Team collaboration, unified kanban tracking & progress indicators
            </p>
          </div>

          {/* Login Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="relative px-3 text-xs uppercase tracking-widest font-bold text-slate-400 bg-white dark:bg-slate-900">
              or Sandbox Demo
            </span>
          </div>

          {/* Quick Demo Access */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Select Demo Member Persona:
              </label>
              <select
                id="demo-user-selector"
                value={selectedDemoUser}
                onChange={(e) => setSelectedDemoUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {users.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} — {member.role}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="demo-signin-btn"
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue as Demo User
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Credit lines */}
        <div className="mt-8 text-center text-slate-400 dark:text-slate-600 text-xs space-y-1">
          <p>Productivity-grade visual board • Styled with Tailwind CSS</p>
          <p className="font-mono text-[10px]">Version 1.0.0 (Local Simulation)</p>
        </div>
      </div>
    </div>
  );
};
