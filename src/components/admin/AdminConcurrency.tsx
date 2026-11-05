import React from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  RefreshCw,
  Activity,
  Zap,
  ArrowRight,
  ShieldCheck,
  Gauge,
  Sliders,
  Clock,
  Sparkles,
  Cog,
} from 'lucide-react';
import { ActiveSection } from '../../types';

interface AdminConcurrencyProps {
  onRunBenchmark: () => void;
  isBenchmarking: boolean;
  benchmarkStats?: {
    totalProcessed: number;
    concurrencyThreads: number;
    elapsedMs: number;
    throughputPerSec: number;
  };
  onNavigateSection?: (section: ActiveSection) => void;
  flaggedCount?: number;
}

export const AdminConcurrency: React.FC<AdminConcurrencyProps> = ({
  onRunBenchmark,
  isBenchmarking,
  benchmarkStats,
  onNavigateSection,
  flaggedCount = 3,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* 1. HERO: Rush-Hour Speed Test Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              🟢 Ready
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Speed &amp; Performance Test
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Test if the machine check system stays fast when thousands of parts arrive from all conveyor lines at the same time.
          </p>
        </div>

        {/* Big Action Button */}
        <button
          onClick={onRunBenchmark}
          disabled={isBenchmarking}
          className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0"
        >
          {isBenchmarking ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Testing 1,000 Parts Now...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>▶ Run Speed Test (1,000 Parts)</span>
            </>
          )}
        </button>
      </div>

      {/* 2. FOUR SIMPLE METRICS FOR COMMON USERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Inspection Speed</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {benchmarkStats ? `${benchmarkStats.throughputPerSec} /sec` : '1,250 /sec'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            ⚡ 10x faster than conveyor belt
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Check Time Per Part</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-2">
            0.8 ms
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            ⏱️ Instant — Zero waiting in line
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Max Capacity</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-2">
            10,000 /min
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            🏭 Handles all 4 factory lines easily
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Conveyor Lag / Delay</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400 mt-2">
            0 Delay
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            🟢 No bottlenecks or traffic jams
          </div>
        </div>
      </div>

      {/* 3. FOUR CONVEYOR LINES STATUS (Live & Visual) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Conveyor Lines Live Flow</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live status of the 4 conveyor lines feeding into the quality inspection camera
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 self-start sm:self-auto">
            ● All 4 Lines Running Smooth
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Line A */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Line A: Precision CNC</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">Camera: Reading actively</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">System Load:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">24% (Light)</span>
            </div>
          </div>

          {/* Line B */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Line B: Die-Casting</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">Camera: Reading actively</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">System Load:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">31% (Normal)</span>
            </div>
          </div>

          {/* Line C */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Line C: Heat Annealing</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">Camera: Reading actively</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">System Load:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">18% (Light)</span>
            </div>
          </div>

          {/* Line D */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Line D: Laser Welding</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">Camera: Reading actively</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">System Load:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">22% (Light)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAST JUMP FOR WORKER, OFFICER & ADMIN (Fast & Easy To Use) */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 shadow-xs space-y-4 bg-white dark:bg-slate-900">
        <div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Fast Access For Floor Team
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Jump to your workstation in 1 click
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Workers, Inspectors, and Admins can switch directly to their primary jobs below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Officer Shortcut */}
          <button
            type="button"
            onClick={() => onNavigateSection && onNavigateSection('officer_workbench')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600">
                  🔬 Part Inspector
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {flaggedCount} waiting
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Inspect the flagged parts and tap Pass/Fail.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-3">
              <span>Go to Inspector Workbench</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Worker Shortcut */}
          <button
            type="button"
            onClick={() => onNavigateSection && onNavigateSection('employee_console')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                  👷 Machine Worker
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Type in temperature & pressure from your dials.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-3">
              <span>Go to Operator Dials</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Admin Shortcut */}
          <button
            type="button"
            onClick={() => onNavigateSection && onNavigateSection('admin_dashboard')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600">
                  👔 Plant Manager
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Overview
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                View total plant pass rate & adjust sensitivity.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-3">
              <span>Go to Manager Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
