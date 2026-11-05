import React, { useState } from 'react';
import {
  BatchItem,
  MaterialGrade,
  ProcessParameters,
  ProductionLine,
  User,
} from '../types';
import { PRESET_SCENARIOS } from '../data/mockData';
import {
  SlidersHorizontal,
  Flame,
  Gauge,
  Activity,
  Zap,
  Clock,
  Droplets,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

interface ParameterLoggingProps {
  onLogBatch: (params: ProcessParameters) => BatchItem;
  recentBatches: BatchItem[];
  currentUser: User;
  onNavigateToPrediction: (batchId: string) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

export const ParameterLogging: React.FC<ParameterLoggingProps> = ({
  onLogBatch,
  recentBatches,
  currentUser,
  onNavigateToPrediction,
  isStreaming,
  onToggleStreaming,
}) => {
  // Form state
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

  // Apply a preset template
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
      operatorName: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    const newBatch = onLogBatch(params);
    setLastLoggedBatch(newBatch);
  };

  // Safe range helpers
  const isTempHigh = temperature > 250 || temperature < 175;
  const isPressDev = pressure < 3.2 || pressure > 6.8;
  const isVibHigh = vibration > 2.5;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Top Banner: Quick Scenario Presets */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Kaggle Dataset Scenario Injector</span>
          </div>
          <button
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto Sensor Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Real-time Sensor Stream</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {preset.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual Parameter Entry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged under: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentUser.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => applyPreset(PRESET_SCENARIOS[0])}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nominal</span>
            </button>
          </div>

          {/* Line & Material Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Production Line
              </label>
              <select
                value={productLine}
                onChange={(e) => setProductLine(e.target.value as ProductionLine)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="Line A - Precision CNC">Line A - Precision CNC</option>
                <option value="Line B - High Pressure Die-Cast">Line B - High Pressure Die-Cast</option>
                <option value="Line C - Thermal Annealing">Line C - Thermal Annealing</option>
                <option value="Line D - Laser Welding">Line D - Laser Welding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Material Grade
              </label>
              <select
                value={materialGrade}
                onChange={(e) => setMaterialGrade(e.target.value as MaterialGrade)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono shadow-2xs"
              >
                <option value="AL-6061-T6">AL-6061-T6 (Aluminum Aerospace)</option>
                <option value="SS-316L">SS-316L (Marine Stainless Steel)</option>
                <option value="TI-6AL-4V">TI-6AL-4V (Grade 5 Titanium Alloy)</option>
                <option value="CR-1045-STEEL">CR-1045-STEEL (Cold Rolled Carbon)</option>
              </select>
            </div>
          </div>

          {/* Core Numerical Sliders / Inputs */}
          <div className="space-y-4 pt-1">
            {/* Temperature */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Chamber Temperature (°C)
                </span>
                <span className={`font-mono font-bold tabular-nums ${isTempHigh ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {temperature.toFixed(1)} °C {isTempHigh && '(Deviation)'}
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="320"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                <span>140°C</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Nominal: 210°C (±15)</span>
                <span>320°C</span>
              </div>
            </div>

            {/* Pressure */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-500" />
                  Hydraulic Pressure (bar)
                </span>
                <span className={`font-mono font-bold tabular-nums ${isPressDev ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {pressure.toFixed(2)} bar {isPressDev && '(Low Pressure Risk)'}
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.05"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                <span>1.5 bar</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Nominal: 4.8 bar</span>
                <span>8.0 bar</span>
              </div>
            </div>

            {/* Vibration */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Spindle Vibration Amplitude (mm/s RMS)
                </span>
                <span className={`font-mono font-bold tabular-nums ${isVibHigh ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {vibration.toFixed(2)} mm/s {isVibHigh && '(Harmonic Chatter)'}
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="5.5"
                step="0.05"
                value={vibration}
                onChange={(e) => setVibration(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                <span>0.3 mm/s</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Nominal: 1.2 mm/s</span>
                <span>5.5 mm/s</span>
              </div>
            </div>

            {/* 4-way Grid for Speed, Cycle Time, Humidity, Cooling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Speed
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{machineSpeed} RPM</span>
                </div>
                <input
                  type="range"
                  min="900"
                  max="2200"
                  step="25"
                  value={machineSpeed}
                  onChange={(e) => setMachineSpeed(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Cycle Time
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{cycleTime.toFixed(1)} s</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="0.5"
                  value={cycleTime}
                  onChange={(e) => setCycleTime(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Humidity
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{humidity.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="0.5"
                  value={humidity}
                  onChange={(e) => setHumidity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Flame className="w-3.5 h-3.5 text-teal-500" /> Cooling Rate
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{coolingRate.toFixed(1)} °C/min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="0.5"
                  value={coolingRate}
                  onChange={(e) => setCoolingRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wide shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Log Batch Parameters & Trigger ML Prediction</span>
          </button>
        </form>

        {/* Right Column: Instant Live Ingestion Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Last Logged Batch Feedback Card */}
          {lastLoggedBatch ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Batch Ingested Successfully</span>
                </div>
                <span className="font-mono text-xs text-slate-900 dark:text-white font-bold">
                  {lastLoggedBatch.id}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ML Defect Probability</div>
                  <div className="text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-400 mt-0.5">
                    {lastLoggedBatch.prediction.defectProbability}%
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Risk Assessment</div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase mt-1 ${
                      lastLoggedBatch.prediction.riskLevel === 'critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : lastLoggedBatch.prediction.riskLevel === 'high'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {lastLoggedBatch.prediction.riskLevel} Risk
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                Predicted Defect:{' '}
                <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                  {lastLoggedBatch.prediction.predictedDefectType}
                </span>
              </div>

              {lastLoggedBatch.prediction.flaggedForInspection ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Automated Triage Flagged:</span> This batch exceeds tolerance thresholds and is queued for physical QC inspection.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Batch is within standard quality distribution. Released for packaging.</span>
                </div>
              )}

              <button
                onClick={() => onNavigateToPrediction(lastLoggedBatch.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full ML Risk Attribution & Details</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center py-8 shadow-xs">
              <SlidersHorizontal className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Ready to Log Batch</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                Configure parameters on the left or select a preset to simulate an incoming production run.
              </div>
            </div>
          )}

          {/* Quick List of Recently Logged Batches */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recent Production Batches</span>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                {recentBatches.length} Total
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recentBatches.slice(0, 5).map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => onNavigateToPrediction(batch.id)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{batch.id}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {batch.parameters.productLine}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {batch.prediction.defectProbability}% Defect
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        batch.prediction.flaggedForInspection ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {batch.prediction.flaggedForInspection ? 'FLAGGED' : 'PASSED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
