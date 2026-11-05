import React, { useState } from 'react';
import { BatchItem, RiskLevel } from '../../types';
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Cog,
} from 'lucide-react';

interface OfficerQueueProps {
  batches: BatchItem[];
  onSelectBatch: (id: string) => void;
  onNavigateToWorkbench: (id: string) => void;
}

export const OfficerQueue: React.FC<OfficerQueueProps> = ({
  batches,
  onSelectBatch,
  onNavigateToWorkbench,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.parameters.productLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.parameters.materialGrade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'all' || b.prediction.riskLevel === riskFilter;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? b.inspection.status === 'pending'
        : b.inspection.status !== 'pending';

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Queue Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
              ⚠️ Needs Officer Check
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Items Waiting for Review
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Batches flagged by the system waiting for quality officer physical check.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Total Batches: <span className="font-bold text-slate-900 dark:text-white">{filteredBatches.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search batch ID, production line, or alloy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk:</span>
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Risks</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="moderate">Moderate Only</option>
            <option value="low">Low Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending QC</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Batches Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Product Line</th>
                <th className="py-3 px-4">Material Alloy</th>
                <th className="py-3 px-4">Defect Probability</th>
                <th className="py-3 px-4">Predicted Type</th>
                <th className="py-3 px-4">Inspection Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredBatches.map((batch) => {
                const isFlagged = batch.prediction.flaggedForInspection;
                const isPending = batch.inspection.status === 'pending';

                return (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {batch.id}
                    </td>
                    <td className="py-3 px-4">{batch.parameters.productLine}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {batch.parameters.materialGrade}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            isFlagged
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {batch.prediction.defectProbability}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">
                          ({batch.prediction.riskLevel})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {batch.prediction.predictedDefectType}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          isPending
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : batch.inspection.status === 'passed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {batch.inspection.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectBatch(batch.id);
                          onNavigateToWorkbench(batch.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
