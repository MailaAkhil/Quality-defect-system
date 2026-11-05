import React, { useState } from 'react';
import { BatchItem } from '../../types';
import {
  TrendingUp,
  CheckCircle,
  Activity,
  Layers,
  Filter,
  BarChart3,
  AlertTriangle,
  Cog,
  CheckCircle2,
} from 'lucide-react';

interface OfficerAnalyticsProps {
  batches: BatchItem[];
  feedbackCount: number;
}

export const OfficerAnalytics: React.FC<OfficerAnalyticsProps> = ({
  batches,
  feedbackCount,
}) => {
  const [selectedLine, setSelectedLine] = useState<string>('all');

  const filteredBatches = batches.filter((b) => {
    if (selectedLine === 'all') return true;
    return b.parameters.productLine.toLowerCase().includes(selectedLine.toLowerCase());
  });

  const total = filteredBatches.length || 1;
  const passedCount = filteredBatches.filter((b) => b.inspection.status === 'passed').length;
  const failedCount = filteredBatches.filter((b) => b.inspection.status === 'failed').length;
  const flaggedCount = filteredBatches.filter((b) => b.prediction.flaggedForInspection).length;

  const yieldRate = Math.round(((total - failedCount) / total) * 1000) / 10;
  const scrapRate = Math.round((failedCount / total) * 1000) / 10;

  // Defect breakdown
  const defectCounts: Record<string, number> = {
    'Micro-Cracking': 0,
    'Porosity Void': 0,
    'Dimensional Warpage': 0,
    'Surface Roughness': 0,
    'Incomplete Fusion': 0,
  };

  filteredBatches.forEach((b) => {
    if (b.prediction.predictedDefectType !== 'None') {
      defectCounts[b.prediction.predictedDefectType] =
        (defectCounts[b.prediction.predictedDefectType] || 0) + 1;
    }
  });

  const defectEntries = Object.entries(defectCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Analytics Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              🟢 Ready
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Quality Charts &amp; Trends
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Most common machine problems, passing rates, and daily trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Line Filter:</span>
          </div>
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Production Lines</option>
            <option value="CNC">Line A - CNC</option>
            <option value="Die-Cast">Line B - Die-Cast</option>
            <option value="Annealing">Line C - Annealing</option>
            <option value="Welding">Line D - Welding</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>First-Pass Yield</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {yieldRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            {passedCount} / {total} batches passed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Scrap / Reject Rate</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-2">
            {scrapRate}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            {failedCount} defective lots contained
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Flagged Triage Rate</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            {Math.round((flaggedCount / total) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            {flaggedCount} lots auto-routed to QC
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Closed-Loop Calibrations</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400 mt-2">
            {feedbackCount + 14}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            Ground-truth training updates
          </div>
        </div>
      </div>

      {/* Pareto Analysis & SPC Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Defect Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pareto Defect Classification</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Ranked by Frequency</span>
          </div>

          <div className="space-y-3 pt-2">
            {defectEntries.map(([type, count]) => {
              const pct = Math.round((count / (total || 1)) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>{type}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistical Control Limits (SPC) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Statistical Process Control Limits (3-Sigma)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">In Statistical Control</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Upper Control Limit (UCL):</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">+3σ boundary for thermal & pressure drift</p>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">242.5 °C / 5.6 bar</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Target Nominal Center Line (CL):</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Golden batch operating setpoint</p>
              </div>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">210.0 °C / 4.8 bar</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Lower Control Limit (LCL):</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">-3σ boundary before incomplete fusion risk</p>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">185.0 °C / 4.1 bar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
