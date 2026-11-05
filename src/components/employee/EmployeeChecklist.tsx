import React, { useState } from 'react';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import { ClipboardList, CheckCircle2, ShieldCheck, Wrench, AlertCircle, Cog, Check } from 'lucide-react';

export const EmployeeChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState({
    thermocoupleCalibrated: true,
    spindleBearingChecked: true,
    hydraulicFluidLevel: true,
    coolantNozzlesAligned: true,
    safetyShieldInterlock: true,
    toolOffsetMeasured: true,
    airPressureRegulator: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckAll = () => {
    setChecklist({
      thermocoupleCalibrated: true,
      spindleBearingChecked: true,
      hydraulicFluidLevel: true,
      coolantNozzlesAligned: true,
      safetyShieldInterlock: true,
      toolOffsetMeasured: true,
      airPressureRegulator: true,
    });
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const allPassed = completedCount === totalCount;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Checklist Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                allPassed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              <span>{allPassed ? '🟢 Ready' : '🟡 Needs Attention'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Machine Setup Check
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Check Machine before shift starts: ensure spindle, hydraulics, and emergency stops are safe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Obvious Action: "Check Machine" button */}
          <button
            type="button"
            onClick={handleCheckAll}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>Check Machine ({completedCount}/{totalCount} Done)</span>
          </button>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Machine Tasks Checklist</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {completedCount} of {totalCount} verified
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Heat Sensor (Thermocouple) Check</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Calibrated to 25°C ambient ice-point standard</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.thermocoupleCalibrated}
              onChange={() => toggleCheck('thermocoupleCalibrated')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Spindle Vibration Baseline Check</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Idle vibration under 0.45 mm/s at 1,000 RPM</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.spindleBearingChecked}
              onChange={() => toggleCheck('spindleBearingChecked')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Hydraulic Fluid Tank Level</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">ISO VG 46 level above minimum threshold index</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.hydraulicFluidLevel}
              onChange={() => toggleCheck('hydraulicFluidLevel')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Coolant Spray Nozzles Clear</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Symmetrical 8-point spray pattern targeting contact point</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.coolantNozzlesAligned}
              onChange={() => toggleCheck('coolantNozzlesAligned')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Safety Shield Interlock Working</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Door interlock locks spindle when door is open</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.safetyShieldInterlock}
              onChange={() => toggleCheck('safetyShieldInterlock')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Tool Offset Measured</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Touch probe Z-height measured against datum</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.toolOffsetMeasured}
              onChange={() => toggleCheck('toolOffsetMeasured')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs transition-colors hover:border-emerald-300">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Air Pressure Regulator Check</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Pneumatic feed pressure locked at 6.0 bar ±0.2</div>
            </div>
            <input
              type="checkbox"
              checked={checklist.airPressureRegulator}
              onChange={() => toggleCheck('airPressureRegulator')}
              className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
          </label>
        </div>

        {/* Big Action Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleCheckAll}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Mark All Checked &amp; Machine Ready</span>
          </button>
        </div>
      </div>

      {/* Plain English Assistant */}
      <PlainEnglishAssistant roleTitle="Trained Operator" />
    </div>
  );
};
