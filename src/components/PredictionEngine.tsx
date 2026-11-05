import React, { useState } from 'react';
import { BatchItem } from '../types';
import {
  Cpu,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PredictionEngineProps {
  batches: BatchItem[];
  selectedBatchId?: string;
  onSelectBatch: (batchId: string) => void;
  onNavigateToInspection: (batchId: string) => void;
  onRunConcurrentBenchmark: () => void;
  isBenchmarking: boolean;
  benchmarkStats?: {
    totalProcessed: number;
    concurrencyThreads: number;
    elapsedMs: number;
    throughputPerSec: number;
  };
}

export const PredictionEngine: React.FC<PredictionEngineProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onNavigateToInspection,
  onRunConcurrentBenchmark,
  isBenchmarking,
  benchmarkStats,
}) => {
  const currentBatch =
    batches.find((b) => b.id === selectedBatchId) || batches[0] || null;

  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredBatches = batches.filter((b) => {
    if (filterRisk === 'all') return true;
    if (filterRisk === 'flagged') return b.prediction.flaggedForInspection;
    if (filterRisk === 'critical') return b.prediction.riskLevel === 'critical';
    if (filterRisk === 'low') return b.prediction.riskLevel === 'low';
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Top Banner: OS Concurrent Processing Benchmark */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Concurrent Batch Processing Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                OS Concurrency
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
              Simulates multi-threaded asynchronous classification pipeline evaluating streaming sensor telemetry concurrently across production lines.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {benchmarkStats && (
            <div className="text-right font-mono text-xs hidden sm:block">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                {benchmarkStats.throughputPerSec} batches/sec
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                {benchmarkStats.totalProcessed} records across {benchmarkStats.concurrencyThreads} threads ({benchmarkStats.elapsedMs}ms)
              </div>
            </div>
          )}

          <button
            onClick={onRunConcurrentBenchmark}
            disabled={isBenchmarking}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            {isBenchmarking ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Execute Concurrent Benchmark</span>
          </button>
        </div>
      </div>

      {currentBatch ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Card: Defect Prediction Diagnostics */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
              {/* Batch Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Batch Identifier</span>
                    <span>·</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{currentBatch.parameters.productLine}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {currentBatch.id}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Inference Latency
                    </div>
                    <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                      {currentBatch.prediction.latencyMs} ms
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Model Confidence
                    </div>
                    <div className="text-xs font-mono text-slate-900 dark:text-white font-bold tabular-nums">
                      {currentBatch.prediction.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Prediction Probability & Risk Severity Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Defect Probability */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 relative overflow-hidden">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Predicted Defect Probability</div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                      {currentBatch.prediction.defectProbability}%
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentBatch.prediction.defectProbability > 65
                          ? 'bg-rose-600'
                          : currentBatch.prediction.defectProbability > 35
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${currentBatch.prediction.defectProbability}%` }}
                    />
                  </div>
                </div>

                {/* Risk Level Tier */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Risk Severity</div>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        currentBatch.prediction.riskLevel === 'critical'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : currentBatch.prediction.riskLevel === 'high'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : currentBatch.prediction.riskLevel === 'moderate'
                          ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {currentBatch.prediction.riskLevel} Risk
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Threshold: Flagged if &ge; 45%
                  </div>
                </div>

                {/* Predicted Defect Mode */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Predicted Failure Mode</div>
                  <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400 font-mono mt-2">
                    {currentBatch.prediction.predictedDefectType}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Material: <span className="text-slate-800 dark:text-slate-200 font-medium">{currentBatch.parameters.materialGrade}</span>
                  </div>
                </div>
              </div>

              {/* Triage Decision Banner */}
              {currentBatch.prediction.flaggedForInspection ? (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                        Action Required: Flagged for Physical Inspection
                      </div>
                      <div className="text-xs text-rose-700 dark:text-rose-300/80 mt-0.5">
                        Batch parameters deviate from standard envelope. Forwarded to QC bench queue for NDT inspection.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToInspection(currentBatch.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <span>Proceed to Inspection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Standard Quality Tolerances Satisfied
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                      Batch parameters conform to statistical process boundaries. Direct routing to shipping approved.
                    </div>
                  </div>
                </div>
              )}

              {/* SHAP-style Feature Impact Waterfall */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Feature Contribution & Root-Cause Attribution (SHAP Analysis)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluates how individual sensor telemetry deviations shift the defect probability
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {currentBatch.prediction.featureContributions.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{feat.feature}</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium">
                            {feat.value}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-xs ${
                              feat.direction === 'increases_risk' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {feat.direction === 'increases_risk' ? '+' : '-'}
                            {feat.impactScore.toFixed(1)} Impact
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              feat.direction === 'increases_risk'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            {feat.direction === 'increases_risk' ? 'Raises Risk' : 'Stabilizing'}
                          </span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1.5">
                        <div
                          className={`h-full ${
                            feat.direction === 'increases_risk' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.abs(feat.impactScore) * 12)}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {feat.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Batch Switcher & Stream Queue */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Production Batch
                </span>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {batches.length} Records
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setFilterRisk('all')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterRisk === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterRisk('flagged')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterRisk === 'flagged'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Flagged
                </button>
                <button
                  onClick={() => setFilterRisk('critical')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterRisk === 'critical'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilterRisk('low')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterRisk === 'low'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Nominal
                </button>
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredBatches.map((b) => {
                  const isSelected = b.id === currentBatch.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectBatch(b.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {b.id}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            b.prediction.flaggedForInspection
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {b.prediction.defectProbability}% Defect
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {b.parameters.productLine} · {b.parameters.materialGrade}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                        <span>Temp: {b.parameters.temperature}°C</span>
                        <span>Vib: {b.parameters.vibration}mm/s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">No batches currently loaded.</div>
      )}
    </div>
  );
};
