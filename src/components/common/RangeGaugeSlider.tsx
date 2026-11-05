import React from 'react';

interface RangeGaugeSliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  safeMin: number;
  safeMax: number;
  onChange: (val: number) => void;
  safeLabel?: string;
  warningLabel?: string;
}

export const RangeGaugeSlider: React.FC<RangeGaugeSliderProps> = ({
  label,
  icon,
  value,
  min,
  max,
  step = 0.1,
  unit,
  safeMin,
  safeMax,
  onChange,
  safeLabel = 'SAFE',
  warningLabel = 'ALERT',
}) => {
  const isSafe = value >= safeMin && value <= safeMax;

  // Calculate percentages for track
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const safeStartPercent = ((safeMin - min) / (max - min)) * 100;
  const safeEndPercent = ((safeMax - min) / (max - min)) * 100;
  const safeWidthPercent = safeEndPercent - safeStartPercent;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isSafe
          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-bold flex items-center gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
          <span className="shrink-0">{icon}</span>
          <span>{label}</span>
        </span>
        <span
          className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-2xs ${
            isSafe
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
          }`}
        >
          <span>{isSafe ? '🟢' : '⚠️'}</span>
          <span>
            {value} {unit} · {isSafe ? safeLabel : warningLabel}
          </span>
        </span>
      </div>

      {/* Visual Multi-Zone Progress Track */}
      <div className="relative w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-visible my-3 select-none">
        {/* Safe green zone band */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/80 rounded-full"
          style={{
            left: `${safeStartPercent}%`,
            width: `${safeWidthPercent}%`,
          }}
          title={`Safe Operating Range: ${safeMin} to ${safeMax} ${unit}`}
        />

        {/* Current Value Indicator Dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md z-10 transition-all ${
            isSafe ? 'bg-emerald-600 ring-2 ring-emerald-400/50' : 'bg-amber-600 ring-2 ring-amber-400/50 animate-pulse'
          }`}
          style={{ left: `${percent}%` }}
        />
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-1 accent-indigo-600 cursor-pointer h-2 bg-transparent"
        aria-label={label}
      />

      {/* Bottom Range Legend */}
      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
        <span>
          {min} {unit}
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          Safe: {safeMin} - {safeMax} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
};
