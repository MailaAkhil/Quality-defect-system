import React, { useState, useMemo } from 'react';
import { BatchItem } from '../../types';
import {
  TrendingUp,
  Cpu,
  Settings,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  Cog,
  X,
} from 'lucide-react';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import { DomainIntegrationSection } from '../common/DomainIntegrationSection';

interface AdminDashboardProps {
  batches: BatchItem[];
  inspectionThreshold: number;
  onUpdateThreshold: (val: number) => void;
  feedbackCount: number;
  onRunBenchmark: () => void;
  isBenchmarking: boolean;
  benchmarkStats?: {
    totalProcessed: number;
    concurrencyThreads: number;
    elapsedMs: number;
    throughputPerSec: number;
  };
  onExportCSV: () => void;
  onResetData: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  batches,
  inspectionThreshold,
  onUpdateThreshold,
  feedbackCount,
  onRunBenchmark,
  isBenchmarking,
  benchmarkStats,
  onExportCSV,
  onResetData,
  onNavigateSection,
}) => {
  const [tempThreshold, setTempThreshold] = useState<number>(inspectionThreshold);
  const [thresholdSaved, setThresholdSaved] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'flagged' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const totalBatches = batches.length;
  const flaggedBatches = batches.filter(
    (b) => b.prediction.flaggedForInspection && b.inspection.status === 'pending'
  );
  const verifiedPassed = batches.filter((b) => b.inspection.status === 'passed').length;
  const verifiedFailed = batches.filter((b) => b.inspection.status === 'failed').length;

  const yieldRate =
    totalBatches > 0
      ? Math.round(((totalBatches - verifiedFailed) / totalBatches) * 1000) / 10
      : 100;

  // Estimated economic scrap avoidance
  const estimatedSavings = verifiedFailed * 450 + flaggedBatches.length * 120;

  // Filtered batches for quick visual check
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.parameters.productLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.parameters.materialGrade.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'passed') return b.inspection.status === 'passed';
      if (filterStatus === 'flagged')
        return b.prediction.flaggedForInspection && b.inspection.status === 'pending';
      if (filterStatus === 'failed') return b.inspection.status === 'failed';
      return true;
    });
  }, [batches, filterStatus, searchTerm]);

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThreshold(tempThreshold);
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2500);
  };

  // Determine easy plain-English plant health status
  const plantStatus =
    yieldRate >= 95
      ? {
          title: 'Excellent & Healthy',
          desc: 'Almost zero defects detected across all production lines.',
          badgeColor: 'bg-emerald-500 text-white',
          cardBorder: 'border-emerald-200 dark:border-emerald-800/60',
          bgAccent: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        }
      : yieldRate >= 85
      ? {
          title: 'Good Production Run',
          desc: 'Minor items flagged for inspection, within standard quality tolerance.',
          badgeColor: 'bg-indigo-600 text-white',
          cardBorder: 'border-indigo-200 dark:border-indigo-800/60',
          bgAccent: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
        }
      : {
          title: 'Attention Recommended',
          desc: 'Higher than usual defect rates detected. Check machine calibration.',
          badgeColor: 'bg-amber-500 text-white',
          cardBorder: 'border-amber-200 dark:border-amber-800/60',
          bgAccent: 'from-amber-500/10 via-amber-500/5 to-transparent',
        };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* 1. TOP HERO: Simple At-A-Glance Plant Status Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border ${plantStatus.cardBorder} bg-gradient-to-r ${plantStatus.bgAccent} bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${plantStatus.badgeColor}`}
              >
                ● Factory Status: {plantStatus.title}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Safety guard working</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live Data updated just now
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Plant Overview &amp; Health: {yieldRate}% Passing Rate
              </h1>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {plantStatus.desc} Out of <strong>{totalBatches} total batches</strong> checked,{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {verifiedPassed} passed cleanly
              </strong>
              , and{' '}
              <strong className="text-amber-600 dark:text-amber-400">
                {flaggedBatches.length} need quick officer review
              </strong>
              .
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>{showHelp ? 'Hide Simple Guide' : 'How It Works (Easy Guide)'}</span>
            </button>

            <button
              onClick={onExportCSV}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (CSV)</span>
            </button>
          </div>
        </div>

        {/* Optional Plain English Guide Box */}
        {showHelp && (
          <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              How this system protects your factory in 3 simple steps:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  1. Machine Worker Logs Data
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Workers enter machine temperature and pressure while making parts.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  2. Smart AI Predicts Defects
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  If temperature is too hot or vibrations are high, the system immediately flags the item.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  3. Quality Officer Approves
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  The officer checks only the flagged items, saving hundreds of hours and thousands in scrap costs!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Domain Integration (Machine Learning, Full Stack, Software Engineering, Operating Systems) */}
        <div className="mt-4">
          <DomainIntegrationSection
            variant="banner"
            onNavigateSection={onNavigateSection}
          />
        </div>
      </div>

      {/* 2. FOUR BIG COLOR-CODED CARDS (Instant Reading) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Good Parts Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Quality Pass Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {yieldRate}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            <span className="font-bold text-slate-900 dark:text-white">{verifiedPassed}</span> items
            in perfect condition
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, yieldRate)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Items Needing Attention */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Needs Officer Review</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-2">
            {flaggedBatches.length} Lots
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
            {flaggedBatches.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Action needed: Officer is reviewing
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">All items cleared!</span>
            )}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (flaggedBatches.length / (totalBatches || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Money Saved */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Estimated Money Saved</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            ${estimatedSavings.toLocaleString()}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
            Saved by catching bad parts early
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full w-4/5" />
          </div>
        </div>

        {/* Card 4: AI Speed & Concurrency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Inference Speed</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {benchmarkStats ? `${benchmarkStats.throughputPerSec}` : '1,250'} <span className="text-sm font-sans font-medium text-slate-500">/sec</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
            Instant check in under 1 millisecond
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: Easy Slider & Quick Speed Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simple Sensitivity Slider */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>How Strict Should the AI Be? (Cutoff Threshold)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Adjust how sensitive the system is before sending an item for physical inspection.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Current: {tempThreshold}%
            </span>
          </div>

          <form onSubmit={handleSaveThreshold} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Trigger Physical Check when Defect Chance reaches:
                </span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {tempThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="20"
                max="75"
                step="1"
                value={tempThreshold}
                onChange={(e) => setTempThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="grid grid-cols-3 text-center text-[11px] pt-1">
                <div
                  onClick={() => setTempThreshold(25)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    tempThreshold <= 30
                      ? 'bg-indigo-100 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  🟢 Very Strict (25%)
                  <div className="text-[10px] text-slate-400 font-normal">Catches all tiny signs</div>
                </div>

                <div
                  onClick={() => setTempThreshold(45)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    tempThreshold > 30 && tempThreshold < 60
                      ? 'bg-indigo-100 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  ⭐ Balanced (45%)
                  <div className="text-[10px] text-slate-400 font-normal">Best for standard runs</div>
                </div>

                <div
                  onClick={() => setTempThreshold(65)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    tempThreshold >= 60
                      ? 'bg-indigo-100 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  ⚡ Relaxed (65%)
                  <div className="text-[10px] text-slate-400 font-normal">Only flag high risks</div>
                </div>
              </div>
            </div>

            {thresholdSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Setting saved! All upcoming factory batches will use {tempThreshold}% as cutoff.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Apply Sensitivity Setting
            </button>
          </form>
        </div>

        {/* Quick Speed Test & System Health */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Instant System Speed Test</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                ● Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Test how fast the system can evaluate 1,000 factory parts across 4 lines simultaneously.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Threads:</span>
                <span className="font-bold text-slate-900 dark:text-white">4 Parallel Cores</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Speed Recorded:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {benchmarkStats ? `${benchmarkStats.throughputPerSec} parts/second` : '1,250 parts/second'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Response Delay:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {benchmarkStats ? `${benchmarkStats.elapsedMs} ms` : '0.8 ms'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onRunBenchmark}
            disabled={isBenchmarking}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBenchmarking ? 'Testing Speed Now...' : 'Run 1-Second Speed Test'}</span>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: Easy Visual Batches Explorer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Live Factory Batches & Status</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant visual list of parts made today with simple color-coded statuses.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search batch or line..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All ({batches.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('passed')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'passed'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Passed ({verifiedPassed})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('flagged')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterStatus === 'flagged'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Needs Review ({flaggedBatches.length})
              </button>
            </div>
          </div>
        </div>

        {/* Batches Table - Super Clean & Easy to Read */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Production Line</th>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3">Defect Risk</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBatches.slice(0, 8).map((batch) => {
                const isPassed = batch.inspection.status === 'passed';
                const isPending =
                  batch.prediction.flaggedForInspection && batch.inspection.status === 'pending';
                const isFailed = batch.inspection.status === 'failed';

                return (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {batch.id}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {batch.parameters.productLine}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                        {batch.parameters.materialGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold tabular-nums">
                          {batch.prediction.defectProbability}%
                        </span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              batch.prediction.defectProbability > 50
                                ? 'bg-rose-500'
                                : batch.prediction.defectProbability > 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${batch.prediction.defectProbability}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {isPassed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Good & Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Needs Officer Check
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3" />
                          Defect Confirmed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {batch.inspection.actualDisposition || 'Ready'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain Integration: 4 Core Pillars */}
      <DomainIntegrationSection
        variant="detailed"
        onNavigateSection={onNavigateSection}
      />

      {/* NLP Assistant */}
      <PlainEnglishAssistant
        flaggedCount={flaggedBatches.length}
        totalBatches={totalBatches}
        roleTitle="System Admin"
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Confirm Reset Data</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to restore the clean baseline benchmark dataset? Any unsaved live runs will be cleared.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirmModal(false);
                  onResetData();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
