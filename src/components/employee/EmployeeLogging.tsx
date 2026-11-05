import React, { useState } from 'react';
import { BatchItem, ProcessParameters, ProductionLine, MaterialGrade } from '../../types';
import { PRESET_SCENARIOS } from '../../data/mockData';
import { RangeGaugeSlider } from '../common/RangeGaugeSlider';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import {
  SlidersHorizontal,
  Flame,
  Gauge,
  Activity,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Cog,
  CheckCircle2,
} from 'lucide-react';

interface EmployeeLoggingProps {
  onLogBatch: (params: ProcessParameters) => BatchItem;
  recentBatches: BatchItem[];
}

export const EmployeeLogging: React.FC<EmployeeLoggingProps> = ({
  onLogBatch,
  recentBatches,
}) => {
  const [productLine, setProductLine] = useState<ProductionLine>('Line A - Precision CNC');
  const [materialGrade, setMaterialGrade] = useState<MaterialGrade>('AL-6061-T6');
  const [temperature, setTemperature] = useState<number>(210.5);
  const [pressure, setPressure] = useState<number>(4.82);
  const [vibration, setVibration] = useState<number>(1.18);
  const [machineSpeed, setMachineSpeed] = useState<number>(1450);
  const [cycleTime, setCycleTime] = useState<number>(42.0);
  const [humidity, setHumidity] = useState<number>(44.0);
  const [coolingRate, setCoolingRate] = useState<number>(28.0);
  const [lastLoggedBatch, setLastLoggedBatch] = useState<BatchItem | null>(null);

  const applyPreset = (preset: (typeof PRESET_SCENARIOS)[0]) => {
    if (preset.params.productLine) setProductLine(preset.params.productLine);
    if (preset.params.materialGrade) setMaterialGrade(preset.params.materialGrade);
    if (preset.params.temperature !== undefined) setTemperature(preset.params.temperature);
    if (preset.params.pressure !== undefined) setPressure(preset.params.pressure);
    if (preset.params.vibration !== undefined) setVibration(preset.params.vibration);
    if (preset.params.machineSpeed !== undefined) setMachineSpeed(preset.params.machineSpeed);
    if (preset.params.cycleTime !== undefined) setCycleTime(preset.params.cycleTime);
    if (preset.params.humidity !== undefined) setHumidity(preset.params.humidity);
    if (preset.params.coolingRate !== undefined) setCoolingRate(preset.params.coolingRate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const params: ProcessParameters = {
      batchId,
      productLine,
      materialGrade,
      temperature,
      pressure,
      vibration,
      machineSpeed,
      cycleTime,
      humidity,
      coolingRate,
      operatorName: 'Trained Operator',
      timestamp: new Date().toISOString(),
    };

    const newBatch = onLogBatch(params);
    setLastLoggedBatch(newBatch);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* Logging Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-2xs">
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
              Enter Machine Readings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Enter today&apos;s readings: heat, pressure, vibration, and machine speed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset(PRESET_SCENARIOS[0])}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Load Safe Normal Readings</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Load Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESET_SCENARIOS.slice(0, 4).map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(preset)}
            className="p-3.5 text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {preset.label}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {preset.description}
            </div>
          </button>
        ))}
      </div>

      {/* Parameter Entry Form with RangeGaugeSlider */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Production Line
              </label>
              <select
                value={productLine}
                onChange={(e) => setProductLine(e.target.value as ProductionLine)}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <option value="Line A - Precision CNC">Line A - Precision CNC</option>
                <option value="Line B - High Pressure Die-Cast">Line B - High Pressure Die-Cast</option>
                <option value="Line C - Thermal Annealing">Line C - Thermal Annealing</option>
                <option value="Line D - Laser Welding">Line D - Laser Welding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Material Grade
              </label>
              <select
                value={materialGrade}
                onChange={(e) => setMaterialGrade(e.target.value as MaterialGrade)}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono shadow-2xs"
              >
                <option value="AL-6061-T6">AL-6061-T6 (Aluminum)</option>
                <option value="SS-316L">SS-316L (Marine Stainless)</option>
                <option value="TI-6AL-4V">TI-6AL-4V (Titanium)</option>
                <option value="CR-1045-STEEL">CR-1045-STEEL (Carbon Steel)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RangeGaugeSlider
              label="Machine Heat"
              icon={<Flame className="w-4 h-4 text-amber-500" />}
              value={temperature}
              min={160}
              max={300}
              step={0.5}
              unit="°C"
              safeMin={195}
              safeMax={235}
              onChange={(val) => setTemperature(val)}
              safeLabel="SAFE HEAT"
              warningLabel="HEAT WARNING"
            />

            <RangeGaugeSlider
              label="Hydraulic Pressure"
              icon={<Gauge className="w-4 h-4 text-indigo-500" />}
              value={pressure}
              min={2.0}
              max={8.0}
              step={0.05}
              unit="bar"
              safeMin={4.0}
              safeMax={5.8}
              onChange={(val) => setPressure(val)}
              safeLabel="SAFE PRESSURE"
              warningLabel="PRESSURE ALERT"
            />

            <RangeGaugeSlider
              label="Spindle Vibration"
              icon={<Activity className="w-4 h-4 text-purple-500" />}
              value={vibration}
              min={0.5}
              max={5.0}
              step={0.05}
              unit="mm/s"
              safeMin={0.5}
              safeMax={2.2}
              onChange={(val) => setVibration(val)}
              safeLabel="SMOOTH"
              warningLabel="SHAKING ALERT"
            />

            <RangeGaugeSlider
              label="Machine Rotation Speed"
              icon={<Zap className="w-4 h-4 text-emerald-500" />}
              value={machineSpeed}
              min={1000}
              max={2200}
              step={10}
              unit="RPM"
              safeMin={1300}
              safeMax={1650}
              onChange={(val) => setMachineSpeed(val)}
              safeLabel="OPTIMAL SPEED"
              warningLabel="SPEED ALERT"
            />
          </div>

          {/* One Clear Action per Card: "Enter Machine Readings" */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Enter Machine Readings</span>
          </button>
        </form>

        {/* Feedback Alert Box */}
        {lastLoggedBatch && (
          <div
            className={`p-4 rounded-2xl border ${
              lastLoggedBatch.prediction.flaggedForInspection
                ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
            } text-xs space-y-2`}
          >
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-2">
                {lastLoggedBatch.prediction.flaggedForInspection ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {lastLoggedBatch.id} Logged!
              </span>
              <span className="font-mono">
                {lastLoggedBatch.prediction.defectProbability}% Defect Risk
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {lastLoggedBatch.prediction.flaggedForInspection
                ? `⚠️ AI Warning: High chance of ${lastLoggedBatch.prediction.predictedDefectType}. Flagged for review.`
                : '✅ All readings within safe limits. Ready for production release.'}
            </p>
          </div>
        )}
      </div>

      {/* NLP Assistant */}
      <PlainEnglishAssistant
        machineTemperature={temperature}
        machinePressure={pressure}
        machineVibration={vibration}
        flaggedCount={recentBatches.filter((b) => b.prediction.flaggedForInspection).length}
        totalBatches={recentBatches.length}
        roleTitle="Trained Operator"
      />
    </div>
  );
};
