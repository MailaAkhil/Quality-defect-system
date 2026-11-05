import React, { useState } from 'react';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import { ShieldAlert, AlertTriangle, CheckCircle2, Flame, Gauge, Activity, Zap, Cog, X } from 'lucide-react';

export const EmployeeSafety: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isEmergencyHalted, setIsEmergencyHalted] = useState<boolean>(false);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Safety Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isEmergencyHalted
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              <span>{isEmergencyHalted ? '🔴 Stop — Unsafe' : '🟢 Ready'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Safety Limits & Warnings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Keep your machine within safe heat, pressure, and vibration limits to prevent defects or damage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isEmergencyHalted) {
                setIsEmergencyHalted(false);
              } else {
                setShowConfirmModal(true);
              }
            }}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isEmergencyHalted
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyHalted ? 'Resume Machine Operation' : 'Emergency Stop Machine'}</span>
          </button>
        </div>
      </div>

      {/* Safety Envelopes Grid with Large Text & Plain Words */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Heat Limits</span>
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-3">
              195°C – 235°C
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
              🟢 Safe Window: ±15°C
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Warning trips above 235°C. Emergency cutoff at 248°C.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
            Sensor: T-Type Thermocouple
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Hydraulic Pressure</span>
              <Gauge className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-3">
              4.0 – 5.8 bar
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
              🟢 Holding: 4.82 bar
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Warning trips below 3.8 bar or above 6.0 bar.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
            Sensor: Digital Piezoresistive
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Spindle Vibration</span>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-3">
              &le; 2.2 mm/s
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
              🟢 Baseline: 1.18 mm/s
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Chatter alert above 2.2 mm/s. Bearing alarm at 2.6 mm/s.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
            Sensor: Triaxial MEMS Accelerometer
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Machine Speed</span>
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-3">
              1300 – 1650 RPM
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
              🟢 Operating: 1450 RPM
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Warning trips if spindle speed slows under 1200 RPM.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
            Sensor: Optical Rotary Encoder
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Safety Critical Action */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Emergency Stop Confirmation</span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to stop the machine right now? This triggers an immediate emergency stop, disengaging motors and halting the conveyor line.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEmergencyHalted(true);
                  setShowConfirmModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Confirm Emergency Stop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NLP Assistant */}
      <PlainEnglishAssistant roleTitle="Trained Operator" />
    </div>
  );
};
