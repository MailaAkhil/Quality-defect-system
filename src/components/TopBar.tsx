
import React, { useEffect, useState } from 'react';
import { ActiveSection } from '../types';
import {
  Download,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  LogOut,
  Cog,
  CheckCircle2,
  Database,
  Presentation,
} from 'lucide-react';

interface TopBarProps {
  activeSection: ActiveSection;
  totalBatches: number;
  flaggedCount: number;
  onSimulateConcurrent: () => void;
  onResetData: () => void;
  onExportReport: () => void;
  isSimulating: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
  onNavigateToPortal?: () => void;
  onLogout?: () => void;
  onOpenMySqlModal?: () => void;
  onOpenPresentationModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  totalBatches,
  flaggedCount,
  onResetData,
  onExportReport,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  onNavigateToPortal,
  onLogout,
  onOpenMySqlModal,
  onOpenPresentationModal,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const sectionTitles: Record<
    string,
    { title: string; subtitle: string }
  > = {
    predicted_machines: {
      title: 'Find Machine Problems (Predicted Machines)',
      subtitle:
        'AI4I trained defect classification & machine health monitoring',
    },
    admin_dashboard: {
      title: 'Plant Overview & Health',
      subtitle:
        'Overall machine health, passing rates, and saved costs at a glance',
    },
    admin_calibration: {
      title: 'Machine Setup Check & AI Settings',
      subtitle:
        'Set how strict the system checks machines and parts',
    },
    admin_concurrency: {
      title: 'Speed & Performance Test',
      subtitle:
        'Test system speed when high volumes of parts arrive',
    },
    admin_audit: {
      title: 'Security & History Logs',
      subtitle:
        'Review system history, security roles, and activity records',
    },
    officer_workbench: {
      title: 'Quality Inspection Station',
      subtitle:
        'Inspect parts, run physical checks, and approve or reject batches',
    },
    officer_queue: {
      title: 'Items Waiting for Review',
      subtitle:
        'Batches flagged by the system waiting for quality check',
    },
    officer_diagnostics: {
      title: 'Defect Root Cause',
      subtitle:
        'See exactly why an item was flagged (heat, pressure, vibration)',
    },
    officer_analytics: {
      title: 'Quality Charts & Trends',
      subtitle:
        'Common defect types, passing rates, and daily trends',
    },
    employee_console: {
      title: 'Machine Status',
      subtitle:
        'Live machine status, safe running limits, and quick batch readings',
    },
    employee_logging: {
      title: 'Enter Machine Readings',
      subtitle:
        "Enter today's readings: heat, pressure, vibration, and machine speed",
    },
    employee_checklist: {
      title: 'Machine Setup Check',
      subtitle:
        'Check machine and safety guard before starting work',
    },
    employee_safety: {
      title: 'Safety Limits & Warnings',
      subtitle:
        'Safe machine operating limits and warning alerts',
    },
  };

  const current = sectionTitles[activeSection] || {
    title: 'Machine Quality Check',
    subtitle: 'Find Machine Problems & Live Machine Quality',
  };

  return (
    <header className="w-full px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3 z-20 shrink-0 shadow-2xs transition-colors duration-150">

      {/* ROW 1: Title and Action Buttons */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">

        {/* Dashboard Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Cog className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {current.title}
            </h2>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end flex-wrap gap-2 shrink-0">

          {onNavigateToPortal && (
            <button
              type="button"
              onClick={onNavigateToPortal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Go to Home"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          {onOpenPresentationModal && (
            <button
              type="button"
              onClick={onOpenPresentationModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Open Project Presentation"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Project PPT</span>
              <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold">
                Guide
              </span>
            </button>
          )}

          {onOpenMySqlModal && (
            <button
              type="button"
              onClick={onOpenMySqlModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="MySQL Database Status & Data Sync"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MySQL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </button>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                if (theme !== 'light') onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to White Mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">White</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (theme !== 'dark') onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 text-white shadow-sm border border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to Dark Mode"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {/* Download CSV */}
          <button
            type="button"
            onClick={onExportReport}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Download complete factory parts report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onResetData}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="Reset to clean sample dataset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Machine Status and Telemetry */}
      <div className="w-full flex flex-wrap items-center gap-2 sm:gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">

        {/* Safety Guard */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Safety guard working</span>
        </div>

        {/* Machine Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Status: Ready</span>
        </div>

        {/* Total Parts */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 text-slate-600 dark:text-slate-300 font-mono">
          <span className="text-slate-400">Total:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {totalBatches} Parts
          </span>
        </div>

        {/* Needs Attention */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
            flaggedCount > 0
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
          }`}
          title={
            flaggedCount > 0
              ? `${flaggedCount} parts need inspection check`
              : 'All parts verified safe'
          }
        >
          <span>
            {flaggedCount > 0
              ? `⚠️ ${flaggedCount} Needs Attention`
              : '🟢 All Safe'}
          </span>
        </div>

        {/* Digital Clock */}
        <div className="text-slate-400 font-mono text-[11px] tabular-nums ml-auto">
          {time}
        </div>
      </div>
    </header>
  );
};
