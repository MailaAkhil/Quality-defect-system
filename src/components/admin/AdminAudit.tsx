import React from 'react';
import { Lock, Download, RotateCcw, ShieldCheck, CheckCircle2, FileText, Cog } from 'lucide-react';

interface AdminAuditProps {
  onExportCSV: () => void;
  onResetData: () => void;
}

export const AdminAudit: React.FC<AdminAuditProps> = ({
  onExportCSV,
  onResetData,
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Governance & Audit Header */}
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
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Security &amp; History Logs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Review changes, security roles, and download full activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Logs</span>
          </button>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span>Role Permissions Matrix</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enforced isolation between shop floor parameter entry, quality officer physical sign-off, and administrative system tuning.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Primary Station</th>
                <th className="py-3 px-4">Sensor Logging</th>
                <th className="py-3 px-4">NDT Sign-Off</th>
                <th className="py-3 px-4">ML Threshold Calibration</th>
                <th className="py-3 px-4">System Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Admin</td>
                <td className="py-3.5 px-4">Plant Management & Operations</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Override Release</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Master Admin</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Full Export / Reset</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">Quality Officer</td>
                <td className="py-3.5 px-4">Quality Assurance Bench</td>
                <td className="py-3.5 px-4 text-slate-400">Read Telemetry</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Sign-Off Authority</td>
                <td className="py-3.5 px-4 text-indigo-600 font-semibold">Ground-Truth Feedback</td>
                <td className="py-3.5 px-4 text-slate-400">Read Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Employee</td>
                <td className="py-3.5 px-4">Production Line Floor</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">Direct Machine Log</td>
                <td className="py-3.5 px-4 text-slate-400">Restricted</td>
                <td className="py-3.5 px-4 text-slate-400">Restricted</td>
                <td className="py-3.5 px-4 text-slate-400">Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
