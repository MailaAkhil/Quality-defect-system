import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import {
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  HelpCircle,
  X,
  Lock,
  Check,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onClose?: () => void;
  initialRole?: UserRole;
  isModal?: boolean;
}

export interface RoleCredential {
  role: UserRole;
  title: string;
  icon: string;
  badge: string;
  password: string;
  station: string;
}

export const ROLE_CREDENTIALS: Record<UserRole, RoleCredential> = {
  employee: {
    role: 'employee',
    title: 'Worker',
    icon: '👷',
    badge: 'EMP-1120',
    password: 'Worker@2026',
    station: 'Machine Floor Console',
  },
  quality_officer: {
    role: 'quality_officer',
    title: 'Officer',
    icon: '🔬',
    badge: 'QO-8842',
    password: 'Officer@2026',
    station: 'Inspection Workbench',
  },
  admin: {
    role: 'admin',
    title: 'Admin',
    icon: '👔',
    badge: 'ADM-001',
    password: 'Admin@2026',
    station: 'Executive Governance',
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  theme = 'light',
  onToggleTheme,
  onClose,
  initialRole = 'employee',
  isModal = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const activeCredential = ROLE_CREDENTIALS[selectedRole];

  // User-Centered Design: Selecting a role resets input and provides clean focus
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setPassword('');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const expected = ROLE_CREDENTIALS[selectedRole];

    // STRICT PASSWORD VERIFICATION: Only correct password unlocks dashboard
    if (password.trim() !== expected.password) {
      setErrorMessage(
        `Incorrect password for ${activeCredential.icon} ${expected.title}. Access denied — only the correct password opens the dashboard.`
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const activeUser = DEMO_USERS.find((u) => u.role === selectedRole) || DEMO_USERS[0];
      setIsLoading(false);
      onLogin(activeUser);
    }, 350);
  };

  const loginCard = (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/50 relative z-10 my-auto">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
        {/* Brand Logo */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md shadow-indigo-500/20 mx-auto mb-4 bg-slate-900">
          <img
            src="/images/vision_sensor_logo_1790964273856.jpg.jpeg"
            alt="Quality Control Vision Sensor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Requested Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Enter your password to continue
          </p>
        </div>

        {/* 1. ROLE SELECTION (Worker, Officer, Admin in requested order) */}
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-2">
            {/* 👷 Worker */}
            <button
              type="button"
              onClick={() => handleSelectRole('employee')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'employee'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-2xl">👷</div>
              <div className="text-xs font-bold truncate mt-1">Worker</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">EMP-1120</div>
            </button>

            {/* 🔬 Officer */}
            <button
              type="button"
              onClick={() => handleSelectRole('quality_officer')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'quality_officer'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-200 font-bold shadow-xs ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-2xl">🔬</div>
              <div className="text-xs font-bold truncate mt-1">Officer</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">QO-8842</div>
            </button>

            {/* 👔 Admin */}
            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 font-bold shadow-xs ring-2 ring-purple-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-2xl">👔</div>
              <div className="text-xs font-bold truncate mt-1">Admin</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">ADM-001</div>
            </button>
          </div>
        </div>

        {/* Error Message Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <div className="font-bold">Incorrect Password</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* 2. PASSWORD FORM (No email mentioned anywhere) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Role: {activeCredential.title}
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter password"
                className={`w-full px-3.5 py-3 pr-10 bg-white dark:bg-slate-950 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-mono shadow-2xs ${
                  errorMessage
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/30'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500/40 focus:border-indigo-500'
                }`}
                required
              />
              {/* Show / Hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Requested Button: "Login" */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Requested Link: "Forgot password?" */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
  );

  const forgotPasswordModal = showForgotPasswordModal && (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
        <button
          type="button"
          onClick={() => setShowForgotPasswordModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          <KeyRound className="w-4 h-4" />
          <span>Password Assistance</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          For security, role passwords are provided directly in the chat instructions and are not displayed inside the dashboard interface.
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            Assigned Roles:
          </div>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center gap-2">
              <span>👷</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Worker</span>
              <span className="text-[10px] text-slate-400 font-mono">(EMP-1120)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>🔬</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Officer</span>
              <span className="text-[10px] text-slate-400 font-mono">(QO-8842)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>👔</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Admin</span>
              <span className="text-[10px] text-slate-400 font-mono">(ADM-001)</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setShowForgotPasswordModal(false)}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="w-full flex justify-center">
        {loginCard}
        {forgotPasswordModal}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center py-8 px-4 sm:p-6 relative overflow-y-auto transition-colors duration-200">
      {/* Background Soft Ambient Accents */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Theme Toggle */}
      {onToggleTheme && (
        <div className="w-full max-w-md flex justify-end mb-3 sm:absolute sm:top-6 sm:right-6 sm:mb-0 sm:w-auto z-20">
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <button
              type="button"
              onClick={() => {
                if (theme !== 'light') onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>White</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (theme !== 'dark') onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 text-white shadow-2xs border border-slate-800'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      )}

      {loginCard}
      {forgotPasswordModal}
    </div>
  );
};
