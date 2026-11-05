import React, { useState } from 'react';
import { BatchItem, ProcessParameters, ProductionLine, MaterialGrade } from '../../types';
import { PRESET_SCENARIOS } from '../../data/mockData';
import { RangeGaugeSlider } from '../common/RangeGaugeSlider';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import { DomainIntegrationSection } from '../common/DomainIntegrationSection';
import {
  Flame,
  Gauge,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Cog,
  Wrench,
  ShieldAlert,
  HelpCircle,
  X,
} from 'lucide-react';

interface EmployeeDashboardProps {
  batches: BatchItem[];
  onLogBatch: (params: ProcessParameters) => BatchItem;
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  batches,
  onLogBatch,
  isStreaming,
  onToggleStreaming,
}) => {
  // Machine operator inputs
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

  // Safety Critical Action Modal State
  const [showStopConfirmModal, setShowStopConfirmModal] = useState<boolean>(false);
  const [isMachineEmergencyStopped, setIsMachineEmergencyStopped] = useState<boolean>(false);

  // Daily checklist for operator
  const [checklist, setChecklist] = useState({
    spindleBearing: true,
    fluidLevel: true,
    coolantSpray: true,
    safetyShield: true,
    emergencyStop: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckAll = () => {
    setChecklist({
      spindleBearing: true,
      fluidLevel: true,
      coolantSpray: true,
      safetyShield: true,
      emergencyStop: true,
    });
  };

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
      operatorName: 'Floor Operator',
      timestamp: new Date().toISOString(),
    };

    const newBatch = onLogBatch(params);
    setLastLoggedBatch(newBatch);
  };

  // Safe tolerance boundaries in plain English (UCD rules)
  const isTempCritical = temperature > 248;
  const isPressCritical = pressure < 3.6 || pressure > 6.2;
  const isVibCritical = vibration > 2.6;

  const isStopUnsafe = isMachineEmergencyStopped || isTempCritical || isPressCritical || isVibCritical;

  const isTempSafe = temperature >= 195 && temperature <= 235;
  const isPressSafe = pressure >= 4.0 && pressure <= 5.8;
  const isVibSafe = vibration <= 2.2;
  const isSpeedSafe = machineSpeed >= 1300 && machineSpeed <= 1650;

  const allSensorsSafe = isTempSafe && isPressSafe && isVibSafe && isSpeedSafe;

  const machineStatus: 'Ready' | 'Needs Attention' | 'Stop — Unsafe' = isStopUnsafe
    ? 'Stop — Unsafe'
    : allSensorsSafe
    ? 'Ready'
    : 'Needs Attention';

  const totalLogged = batches.length;
  const passedCount = batches.filter((b) => !b.prediction.flaggedForInspection).length;
  const checklistDoneCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* 1. TOP HERO: Machine Status Banner with Cog Icon & Clear Statuses */}
      <div
        className={`rounded-3xl border ${
          machineStatus === 'Ready'
            ? 'border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent'
            : machineStatus === 'Needs Attention'
            ? 'border-amber-200 dark:border-amber-800/60 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent'
            : 'border-rose-300 dark:border-rose-800/60 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent'
        } bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Large Clear Status Badge */}
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs ${
                  machineStatus === 'Ready'
                    ? 'bg-emerald-600 text-white'
                    : machineStatus === 'Needs Attention'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white animate-pulse'
                }`}
              >
                <span>{machineStatus === 'Ready' ? '🟢' : machineStatus === 'Needs Attention' ? '🟡' : '🔴'}</span>
                <span>Machine Status: {machineStatus}</span>
              </span>

              {/* Safety Guard Working Pill Badge */}
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Safety guard working</span>
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {productLine}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Machine Quality Check
              </h1>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Check that heat and pressure readings are safe, then enter today&apos;s machine readings below.
            </p>
          </div>

          {/* Action buttons: Auto Stream & Emergency Stop */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleStreaming}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isStreaming
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Live Stream</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isMachineEmergencyStopped) {
                  setIsMachineEmergencyStopped(false);
                } else {
                  setShowStopConfirmModal(true);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isMachineEmergencyStopped
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isMachineEmergencyStopped ? 'Resume Machine' : 'Emergency Stop'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE SUMMARY METRIC CARDS (Familiar words & large numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Batches Produced</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {totalLogged} Units
            </div>
            <div className="text-[11px] text-slate-400">Recorded on this shift</div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            <Gauge className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Passed Cleanly</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {passedCount} Good Batches
            </div>
            <div className="text-[11px] text-slate-400">Zero defects predicted</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Daily Safety Check</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
              {checklistDoneCount} / 5 Done
            </div>
            <div className="text-[11px] text-slate-400">All machine safety confirmed</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: Log Machine Readings + Daily Safety Check */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Enter Machine Readings with RangeGaugeSlider & Progress Bars */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-600" />
                <span>Enter Machine Readings</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust sliders or pick a quick preset to enter today&apos;s machine readings.
              </p>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-bold mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset(PRESET_SCENARIOS[0])}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer shadow-2xs"
              >
                🟢 Normal Safe Run
              </button>
              <button
                type="button"
                onClick={() => applyPreset(PRESET_SCENARIOS[1])}
                className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 text-xs font-bold hover:bg-amber-100 cursor-pointer shadow-2xs"
              >
                🔥 High Heat Warning
              </button>
              <button
                type="button"
                onClick={() => applyPreset(PRESET_SCENARIOS[2])}
                className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 text-xs font-bold hover:bg-rose-100 cursor-pointer shadow-2xs"
              >
                ⚠️ High Vibration
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Machine Line & Material Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Production Line
                </label>
                <select
                  value={productLine}
                  onChange={(e) => setProductLine(e.target.value as ProductionLine)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                >
                  <option value="Line A - Precision CNC">Line A - Precision CNC</option>
                  <option value="Line B - High Pressure Die-Cast">Line B - Die-Cast</option>
                  <option value="Line C - Thermal Annealing">Line C - Annealing</option>
                  <option value="Line D - Laser Welding">Line D - Laser Welding</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Metal Material Alloy
                </label>
                <select
                  value={materialGrade}
                  onChange={(e) => setMaterialGrade(e.target.value as MaterialGrade)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                >
                  <option value="AL-6061-T6">AL-6061-T6 (Aluminum)</option>
                  <option value="SS-316L">SS-316L (Stainless Steel)</option>
                  <option value="TI-6AL-4V">TI-6AL-4V (Titanium Alloy)</option>
                  <option value="CR-1045-STEEL">CR-1045-STEEL (Carbon Steel)</option>
                </select>
              </div>
            </div>

            {/* The 4 Core Machine Sensors with RangeGaugeSlider & visual indicator dots */}
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
                safeLabel="NORMAL HEAT"
                warningLabel="HIGH HEAT ALERT"
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
                safeLabel="NORMAL PRESSURE"
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

            {/* One Clear Action Button per Card: "Enter Machine Readings" */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Log Machine Readings</span>
            </button>
          </form>

          {/* Instant Result Box after Logging */}
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
                  {lastLoggedBatch.id} Logged Successfully!
                </span>
                <span className="font-mono">
                  {lastLoggedBatch.prediction.defectProbability}% Defect Risk
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {lastLoggedBatch.prediction.flaggedForInspection
                  ? `⚠️ AI Warning: High chance of ${lastLoggedBatch.prediction.predictedDefectType} due to abnormal sensor reading. This batch has been sent to the Quality Officer for review.`
                  : '✅ All parameters are within ideal limits. This batch passed machine quality check and is ready for production release.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Daily Safety Check Card (Clear Action: "Check Machine") */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  <span>Daily Safety Check</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {checklistDoneCount}/5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Check machine safety before shift starts.
              </p>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div
                onClick={() => toggleCheck('spindleBearing')}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    checklist.spindleBearing ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checklist.spindleBearing && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Spindle Bearings Clean & Lubricated
                  </div>
                  <div className="text-[11px] text-slate-400">No rattling noises</div>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('fluidLevel')}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    checklist.fluidLevel ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checklist.fluidLevel && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Hydraulic Fluid Above Fill Line
                  </div>
                  <div className="text-[11px] text-slate-400">Tank checked visually</div>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('coolantSpray')}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    checklist.coolantSpray ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checklist.coolantSpray && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Coolant Spray Nozzles Clear
                  </div>
                  <div className="text-[11px] text-slate-400">Flow verified</div>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('safetyShield')}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    checklist.safetyShield ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checklist.safetyShield && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Safety Guard Working
                  </div>
                  <div className="text-[11px] text-slate-400">Door locks on cycle</div>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('emergencyStop')}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    checklist.emergencyStop ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checklist.emergencyStop && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Emergency E-Stop Button Cleared
                  </div>
                  <div className="text-[11px] text-slate-400">Ready for instant stop</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* One Clear Action: "Check Machine" */}
            <button
              type="button"
              onClick={handleCheckAll}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Check Machine ({checklistDoneCount}/5 Ready)</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Daily checklist logged with Trained Operator ID.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Integration (Machine Learning, Full Stack, Software Engineering, Operating Systems) */}
      <DomainIntegrationSection variant="banner" />

      {/* 4. NATURAL LANGUAGE INTERFACE (NLP) ASSISTANT: Ask Machine in Plain English */}
      <PlainEnglishAssistant
        machineTemperature={temperature}
        machinePressure={pressure}
        machineVibration={vibration}
        flaggedCount={batches.filter((b) => b.prediction.flaggedForInspection).length}
        totalBatches={batches.length}
        roleTitle="Trained Operator"
      />

      {/* Emergency Stop Confirmation Modal */}
      {showStopConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Confirm Emergency Machine Stop</span>
              </div>
              <button
                type="button"
                onClick={() => setShowStopConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to trigger an immediate emergency stop for <strong>{productLine}</strong>? This will safely disengage the spindle and halt production until manually reset.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowStopConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMachineEmergencyStopped(true);
                  setShowStopConfirmModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Stop Machine Immediately</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
