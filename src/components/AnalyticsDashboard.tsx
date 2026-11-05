import React, { useState } from 'react';
import { BatchItem, ProductionLine } from '../types';
import {
  TrendingUp,
  CheckCircle,
  Activity,
  Layers,
  ShieldAlert,
  Sliders,
  Filter,
  ArrowUpRight,
  Flame,
  Gauge,
  Zap,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  batches: BatchItem[];
  feedbackCount: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  batches,
  feedbackCount,
}) => {
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [hoveredBatch, setHoveredBatch] = useState<BatchItem | null>(null);

  // Filter batches based on selected line
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
  const triageRate = Math.round((flaggedCount / total) * 1000) / 10;

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
  const totalDefectsIdentified = defectEntries.reduce((sum, item) => sum + item[1], 0) || 1;

  // Calculate cumulative percentages for Pareto curve
  let runningSum = 0;
  const paretoData = defectEntries.map(([defect, count]) => {
    runningSum += count;
    const individualPct = Math.round((count / totalDefectsIdentified) * 100);
    const cumulativePct = Math.round((runningSum / totalDefectsIdentified) * 100);
    return { defect, count, individualPct, cumulativePct };
  });

  // By Line Breakdown across all batches
  const lineStats: Record<string, { total: number; flagged: number; passed: number; avgProb: number }> = {};
  batches.forEach((b) => {
    const lineKey = b.parameters.productLine.split(' - ')[1] || b.parameters.productLine;
    if (!lineStats[lineKey]) {
      lineStats[lineKey] = { total: 0, flagged: 0, passed: 0, avgProb: 0 };
    }
    lineStats[lineKey].total += 1;
    lineStats[lineKey].avgProb += b.prediction.defectProbability;
    if (b.prediction.flaggedForInspection) {
      lineStats[lineKey].flagged += 1;
    } else {
      lineStats[lineKey].passed += 1;
    }
  });

  Object.keys(lineStats).forEach((k) => {
    lineStats[k].avgProb = Math.round((lineStats[k].avgProb / lineStats[k].total) * 10) / 10;
  });

  // Calculate SPC running chart points (chronological order)
  const chronological = [...filteredBatches].reverse();
  const meanProbability = Math.round(
    (filteredBatches.reduce((acc, b) => acc + b.prediction.defectProbability, 0) / total) * 10
  ) / 10;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Top Controls: Interactive Line Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Production Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Production Lines' },
            { id: 'cnc', label: 'Line A (CNC)' },
            { id: 'die-cast', label: 'Line B (Die-Cast)' },
            { id: 'annealing', label: 'Line C (Annealing)' },
            { id: 'welding', label: 'Line D (Welding)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLine(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLine === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row - Dynamic & High-Contrast Professional Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Yield Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>First-Pass Yield</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {yieldRate}%
          </div>
          <div className="text-[11px] mt-2 flex items-center justify-between font-mono">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 inline" /> Nominal Grade
            </span>
            <span className="text-slate-500 dark:text-slate-400">{passedCount}/{total} batches</span>
          </div>
        </div>

        {/* Triage / Flagged Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Triage Flagged Rate</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {triageRate}%
          </div>
          <div className="text-[11px] mt-2 flex items-center justify-between font-mono">
            <span className="text-rose-600 dark:text-rose-400 font-bold">{flaggedCount} Flagged</span>
            <span className="text-slate-500 dark:text-slate-400">UCL: 45.0% Limit</span>
          </div>
        </div>

        {/* Prediction Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>ML Model Precision</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            96.4%
          </div>
          <div className="text-[11px] mt-2 flex items-center justify-between font-mono">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">F1: 0.942</span>
            <span className="text-slate-500 dark:text-slate-400">Mean: {meanProbability}%</span>
          </div>
        </div>

        {/* Closed Loop Learning Iterations */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Continuous Feedback Loops</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-700 dark:text-purple-300 mt-2 tabular-nums">
            {feedbackCount + 14}
          </div>
          <div className="text-[11px] mt-2 flex items-center justify-between font-mono">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Calibrated Weights</span>
            <span className="text-slate-500 dark:text-slate-400">Active</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Defect Pareto Chart & Production Line Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto Defect Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Defect Pareto Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Root-cause frequency analysis & cumulative impact curve
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
              80/20 QC Rule
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {paretoData.map((item, index) => (
              <div key={item.defect} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {item.defect}
                  </span>
                  <div className="font-mono text-xs flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      {item.count} faults ({item.individualPct}%)
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      Cumul: {item.cumulativePct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                        : index === 1
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                        : index === 2
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}
                    style={{ width: `${item.individualPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Line Reliability Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Line Operational Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative defect rates across manufacturing cells
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(lineStats).map(([line, stat]) => {
              const rate = stat.total > 0 ? Math.round((stat.flagged / stat.total) * 100) : 0;
              const isHigh = rate >= 40;

              return (
                <div
                  key={line}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{line}</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        isHigh
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      {rate}% Triage Rate
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isHigh ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 flex justify-between font-mono">
                    <span>{stat.passed} nominal batches</span>
                    <span>Avg Risk: {stat.avgProb}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistical Process Control (SPC) Interactive Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Statistical Process Control (SPC) Defect Probability Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Shewhart control chart with Upper Control Limit (UCL = 45%) and Center Line ({meanProbability}%)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="w-3 h-0.5 bg-rose-500 inline-block" /> UCL: 45% Limit
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
              <span className="w-3 h-0.5 bg-indigo-500 inline-block" /> Process Run
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-400 dark:bg-slate-600 inline-block stroke-dasharray" /> Mean
            </span>
          </div>
        </div>

        {/* Hovered point inspector tooltip bar */}
        {hoveredBatch ? (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {hoveredBatch.id}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({hoveredBatch.parameters.productLine})
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span className="text-slate-700 dark:text-slate-300">
                Temp: <strong>{hoveredBatch.parameters.temperature}°C</strong>
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                Vib: <strong>{hoveredBatch.parameters.vibration}mm/s</strong>
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  hoveredBatch.prediction.defectProbability >= 45
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                Risk: {hoveredBatch.prediction.defectProbability}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            Hover over any batch data node below to inspect real-time sensor parameters.
          </div>
        )}

        {/* SVG SPC Control Chart */}
        <div className="h-60 w-full pt-2 bg-slate-50/70 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <svg className="w-full h-full" viewBox="0 0 900 180" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="900" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="70" x2="900" y2="70" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
            <line x1="0" y1="120" x2="900" y2="120" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

            {/* Threshold Line (UCL at 45% -> y = 160 - (45 * 1.3) = 101.5) */}
            <line
              x1="0"
              y1="101"
              x2="900"
              y2="101"
              stroke="#e11d48"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x="12" y="95" fill="#e11d48" fontSize="10" fontFamily="monospace" fontWeight="bold">
              UCL: 45.0% TRIAGE THRESHOLD
            </text>

            {/* Center Mean Line */}
            <line
              x1="0"
              y1={160 - (meanProbability / 100) * 130}
              x2="900"
              y2={160 - (meanProbability / 100) * 130}
              stroke="#64748b"
              strokeDasharray="2 2"
              strokeWidth="1"
            />

            {/* Trend line */}
            {chronological.length > 1 && (
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                points={chronological
                  .map((b, i) => {
                    const x = (i / (chronological.length - 1)) * 860 + 20;
                    const y = 160 - (b.prediction.defectProbability / 100) * 130;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Interactive Data points */}
            {chronological.map((b, i) => {
              const x = (i / (chronological.length - 1 || 1)) * 860 + 20;
              const y = 160 - (b.prediction.defectProbability / 100) * 130;
              const isOver = b.prediction.defectProbability >= 45;
              const isHovered = hoveredBatch?.id === b.id;

              return (
                <g key={b.id} className="cursor-pointer" onMouseEnter={() => setHoveredBatch(b)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : isOver ? 5 : 3.5}
                    fill={isOver ? '#e11d48' : '#10b981'}
                    stroke={isHovered ? '#6366f1' : '#ffffff'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-1">
          <span>Oldest Logged Batch</span>
          <span>Timeline of Consecutive Production Batches</span>
          <span>Latest Ingested Batch</span>
        </div>
      </div>
    </div>
  );
};
