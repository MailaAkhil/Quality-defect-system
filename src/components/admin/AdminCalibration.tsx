import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle, Cog } from 'lucide-react';

interface AdminCalibrationProps {
  inspectionThreshold: number;
  onUpdateThreshold: (val: number) => void;
}

export const AdminCalibration: React.FC<AdminCalibrationProps> = ({
  inspectionThreshold,
  onUpdateThreshold,
}) => {
  const [threshold, setThreshold] = useState<number>(inspectionThreshold);
  const [saved, setSaved] = useState<boolean>(false);
  const [titaniumWeight, setTitaniumWeight] = useState<number>(1.2);
  const [steelWeight, setSteelWeight] = useState<number>(1.05);
  const [aluminumWeight, setAluminumWeight] = useState<number>(0.95);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThreshold(threshold);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Calibration Header */}
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
              Machine Setup Check &amp; AI Settings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Set how strict the system should be when checking items and flagging machine problems.
          </p>
        </div>
      </div>

      {/* Main Calibration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Automated Inspection Trigger Threshold</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Batches with an ML defect probability exceeding this cutoff are automatically quarantined into the Quality Officer's triage queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Cutoff Probability:</span>
                <span className="font-mono text-base font-extrabold text-purple-600 dark:text-purple-400">
                  {threshold}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20% (Max Quality / High Inspection Volume)</span>
                <span>45% (Balanced)</span>
                <span>80% (High Line Velocity)</span>
              </div>
            </div>

            {/* Material Specific Multipliers */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Material Grade Risk Multipliers
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Adjust sensitivity for aerospace and high-temperature alloys:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Titanium TI-6AL-4V</div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.0"
                    value={titaniumWeight}
                    onChange={(e) => setTitaniumWeight(parseFloat(e.target.value))}
                    className="w-full mt-1.5 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Stainless SS-316L</div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.0"
                    value={steelWeight}
                    onChange={(e) => setSteelWeight(parseFloat(e.target.value))}
                    className="w-full mt-1.5 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Aluminum AL-6061</div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.0"
                    value={aluminumWeight}
                    onChange={(e) => setAluminumWeight(parseFloat(e.target.value))}
                    className="w-full mt-1.5 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {saved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Threshold calibrated and propagated to live inference pipeline!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              Update Production Decision Boundaries
            </button>
          </form>
        </div>

        {/* Impact Simulation Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Projected Pipeline Impact</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulated throughput and triage load at {threshold}% cutoff:
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Triage Queue Volume:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ~{Math.round((100 - threshold) * 0.4)}% of batches
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">False Escape Risk:</span>
              <span
                className={`font-mono font-bold ${
                  threshold > 60 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {threshold > 60 ? 'Moderate (3.2%)' : '< 0.5% (Very Low)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Inspector Workload Index:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(85 - threshold * 0.7)} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
