import React from 'react';
import { BatchItem } from '../../types';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
  Cog,
} from 'lucide-react';

interface OfficerDiagnosticsProps {
  batches: BatchItem[];
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onNavigateToWorkbench: (id: string) => void;
}

export const OfficerDiagnostics: React.FC<OfficerDiagnosticsProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onNavigateToWorkbench,
}) => {
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const pred = currentBatch?.prediction;
  const params = currentBatch?.parameters;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 border-orange-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Diagnostics Header */}
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
              Defect Root Cause
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            See exactly why an item was flagged (temperature, pressure, or vibration).
          </p>
        </div>

        {/* Batch Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Selected Batch:
          </label>
          <select
            value={currentBatch?.id}
            onChange={(e) => onSelectBatch(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.prediction.defectProbability}% Defect Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Diagnostic Assessment Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {currentBatch?.id}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${getRiskBadge(
                  pred?.riskLevel || 'low'
                )}`}
              >
                {pred?.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Line: <strong className="text-slate-700 dark:text-slate-300">{params?.productLine}</strong> · Material: <strong className="text-slate-700 dark:text-slate-300">{params?.materialGrade}</strong>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">ML Probability Score</div>
              <div className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                {pred?.defectProbability}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Model Confidence</div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {pred?.confidence}%
              </div>
            </div>
            <button
              onClick={() => onNavigateToWorkbench(currentBatch.id)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Perform Physical NDT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Contribution Breakdown (SHAP-style risk impact) */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Feature Contribution & Anomaly Attributions</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Inference Latency: {pred?.latencyMs} ms
            </span>
          </div>

          <div className="space-y-3">
            {pred?.featureContributions.map((fc, idx) => {
              const isNegative = fc.direction === 'increases_risk';
              const widthPct = Math.min(Math.abs(fc.impactScore) * 2.5, 100);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="w-48 font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {fc.feature}: <span className="font-mono text-indigo-600 dark:text-indigo-400">{fc.value}</span>
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isNegative ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(widthPct, 6)}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-64 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {fc.description}
                  </div>

                  <div
                    className={`w-28 text-right font-mono font-bold text-xs ${
                      isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isNegative ? `+${fc.impactScore.toFixed(1)}% Risk` : `${fc.impactScore.toFixed(1)}% Safe`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
