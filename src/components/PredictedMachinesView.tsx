import React, { useState, useMemo } from 'react';
import {
  AI4I_DATASET_SAMPLE,
  AI4IMachineRecord,
} from '../data/ai4iDataset';
import {
  evaluateMachine,
  predictAllMachines,
  getModelTrainingMetrics,
  DEFAULT_MODEL_CONFIG,
  ModelTrainingConfig,
  AI4IPrediction,
  MachineStatus,
  answerNaturalLanguageQuery,
} from '../utils/ai4iModel';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Gauge,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Download,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Send,
  Layers,
  Activity,
  Check,
} from 'lucide-react';

interface PredictedMachinesViewProps {}

export const PredictedMachinesView: React.FC<PredictedMachinesViewProps> = () => {
  // Model training configuration state
  const [modelConfig, setModelConfig] = useState<ModelTrainingConfig>(DEFAULT_MODEL_CONFIG);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccessMsg, setRetrainSuccessMsg] = useState<string | null>(null);

  // Tab View: 'catalog' (Predicted Machines List) | 'simulator' (Test Any Machine) | 'training' (Model Training & Metrics)
  const [activeTab, setActiveTab] = useState<'catalog' | 'simulator' | 'training'>('catalog');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | MachineStatus>('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState<string>('all');
  const [variantFilter, setVariantFilter] = useState<'all' | 'L' | 'M' | 'H'>('all');
  const [viewFormat, setViewFormat] = useState<'grid' | 'table'>('grid');

  // Natural Language Interface (NLP) state
  const [nlpInput, setNlpInput] = useState<string>('');
  const [nlpResponse, setNlpResponse] = useState<{
    answer: string;
    matchedMachines: AI4IPrediction[];
  } | null>(null);

  // Selected Machine for Inspection Modal
  const [selectedMachine, setSelectedMachine] = useState<AI4IPrediction | null>(null);
  const [operatorActionDone, setOperatorActionDone] = useState<string | null>(null);

  // Simulator State: Test Any Machine Telemetry Live
  const [simVariant, setSimVariant] = useState<'L' | 'M' | 'H'>('L');
  const [simAirTempK, setSimAirTempK] = useState<number>(298.5);
  const [simProcessTempK, setSimProcessTempK] = useState<number>(308.5);
  const [simSpeedRpm, setSimSpeedRpm] = useState<number>(1420);
  const [simTorqueNm, setSimTorqueNm] = useState<number>(45.0);
  const [simToolWearMin, setSimToolWearMin] = useState<number>(185);

  // Predictions computed across dataset with current model weights
  const predictions = useMemo(() => {
    return predictAllMachines(AI4I_DATASET_SAMPLE, modelConfig);
  }, [modelConfig]);

  // Model training metrics
  const trainingMetrics = useMemo(() => {
    return getModelTrainingMetrics(modelConfig);
  }, [modelConfig]);

  // KPI Summary
  const kpis = useMemo(() => {
    const total = predictions.length;
    const unsafe = predictions.filter((p) => p.status === 'Stop — Unsafe').length;
    const attention = predictions.filter((p) => p.status === 'Needs Attention').length;
    const ready = predictions.filter((p) => p.status === 'Ready').length;
    return { total, unsafe, attention, ready };
  }, [predictions]);

  // Filtered machines
  const filteredMachines = useMemo(() => {
    return predictions.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = m.machineId.toLowerCase().includes(q);
        const matchesType = m.predictedFailureType.toLowerCase().includes(q);
        const matchesReason = m.plainLanguageReason.toLowerCase().includes(q);
        if (!matchesId && !matchesType && !matchesReason) return false;
      }
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (failureTypeFilter !== 'all' && m.predictedFailureType !== failureTypeFilter) return false;
      if (variantFilter !== 'all' && m.type !== variantFilter) return false;
      return true;
    });
  }, [predictions, searchQuery, statusFilter, failureTypeFilter, variantFilter]);

  // Run Simulator Prediction
  const simPrediction = useMemo(() => {
    const testRecord: AI4IMachineRecord = {
      udi: 99999,
      productId: `TEST-${simVariant}01`,
      type: simVariant,
      airTempK: simAirTempK,
      processTempK: simProcessTempK,
      rotationalSpeedRpm: simSpeedRpm,
      torqueNm: simTorqueNm,
      toolWearMin: simToolWearMin,
      actualTarget: 0,
      actualFailureType: 'No Failure',
      location: 'Simulation Chamber',
      lastServiceDate: 'Today',
    };
    return evaluateMachine(testRecord, modelConfig);
  }, [simVariant, simAirTempK, simProcessTempK, simSpeedRpm, simTorqueNm, simToolWearMin, modelConfig]);

  // Handle Natural Language Query
  const handleRunNlp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;
    const res = answerNaturalLanguageQuery(nlpInput, predictions);
    setNlpResponse(res);
  };

  // Re-train the model
  const handleRetrainModel = () => {
    setIsRetraining(true);
    setRetrainSuccessMsg(null);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccessMsg('✅ Model successfully re-trained! Weights updated and predictions refreshed across the machine fleet.');
      setTimeout(() => setRetrainSuccessMsg(null), 5000);
    }, 600);
  };

  // Export CSV of predictions
  const handleExportCSV = () => {
    const headers = [
      'Machine ID',
      'Quality Type',
      'Predicted Status',
      'Failure Probability (%)',
      'Predicted Failure Mode',
      'Air Temp (K)',
      'Process Temp (K)',
      'Delta T (K)',
      'Rotational Speed (RPM)',
      'Torque (Nm)',
      'Tool Wear (min)',
      'Spindle Power (W)',
      'Overstrain Index (min*Nm)',
      'Recommended Action',
    ];

    const rows = predictions.map((p) => [
      p.machineId,
      p.type,
      `"${p.status}"`,
      p.failureProbability,
      p.predictedFailureType,
      p.rawTelemetry.airTempK,
      p.rawTelemetry.processTempK,
      p.calculatedDeltaTK,
      p.rawTelemetry.rotationalSpeedRpm,
      p.rawTelemetry.torqueNm,
      p.rawTelemetry.toolWearMin,
      p.calculatedPowerW,
      p.calculatedOverstrain,
      `"${p.plainLanguageAction.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `AI4I_Predicted_Machines_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Safety guard working</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              🟢 System Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Find Machine Problems (Predicted Machines)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                AI4I Predictive Maintenance Model • Defect classification &amp; root causes in plain English
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Machines */}
        <div
          onClick={() => {
            setStatusFilter('all');
            setActiveTab('catalog');
          }}
          className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Monitored Machines</span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {kpis.total}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Sample from 10,000 dataset
          </div>
        </div>

        {/* Stop — Unsafe (Critical Failures) */}
        <div
          onClick={() => {
            setStatusFilter('Stop — Unsafe');
            setActiveTab('catalog');
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-xs group ${
            statusFilter === 'Stop — Unsafe'
              ? 'bg-rose-100/70 dark:bg-rose-950/80 border-rose-400 dark:border-rose-700 ring-2 ring-rose-400'
              : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span>🔴</span> Stop — Unsafe
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
            {kpis.unsafe}
          </div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1 font-semibold">
            Failure predicted! Stop spindle
          </div>
        </div>

        {/* Needs Attention */}
        <div
          onClick={() => {
            setStatusFilter('Needs Attention');
            setActiveTab('catalog');
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-xs group ${
            statusFilter === 'Needs Attention'
              ? 'bg-amber-100/70 dark:bg-amber-950/80 border-amber-400 dark:border-amber-700 ring-2 ring-amber-400'
              : 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span>🟡</span> Needs Attention
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {kpis.attention}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-semibold">
            Nearing safety limit
          </div>
        </div>

        {/* Ready (Safe) */}
        <div
          onClick={() => {
            setStatusFilter('Ready');
            setActiveTab('catalog');
          }}
          className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-xs group ${
            statusFilter === 'Ready'
              ? 'bg-emerald-100/70 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-400'
              : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span>🟢</span> Ready
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {kpis.ready}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-semibold">
            Safe to operate
          </div>
        </div>
      </div>

      {/* NATURAL LANGUAGE QUERY INTERFACE (NLP for Factory Floor) */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Ask in Plain Words (Natural Language Interface)</span>
        </div>

        <form onSubmit={handleRunNlp} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              placeholder="e.g. 'Is machine M14860 safe?' or 'Which machines have tool wear?' or 'Show unsafe machines'"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">Try asking:</span>
          {[
            'Is machine M14860 safe?',
            'Which machines need tool change?',
            'Show unsafe machines',
            'Any overheating machines?',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setNlpInput(prompt);
                const res = answerNaturalLanguageQuery(prompt, predictions);
                setNlpResponse(res);
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 font-medium hover:text-indigo-600 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* NLP Response Box */}
        {nlpResponse && (
          <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-indigo-200 dark:border-indigo-800/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {nlpResponse.answer}
              </div>
              <button
                onClick={() => setNlpResponse(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            {nlpResponse.matchedMachines.length > 0 && nlpResponse.matchedMachines.length <= 4 && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                {nlpResponse.matchedMachines.map((m) => (
                  <button
                    key={m.machineId}
                    onClick={() => setSelectedMachine(m)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono hover:border-indigo-500"
                  >
                    <span>{m.status === 'Ready' ? '🟢' : m.status === 'Needs Attention' ? '🟡' : '🔴'}</span>
                    <span className="font-bold">{m.machineId}</span>
                    <span className="text-slate-400">({m.predictedFailureType})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Tab Bar: Predicted Machines | Test Any Machine Simulator | Model Training & Metrics */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Predicted Machines ({filteredMachines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Test Any Machine</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'training'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Model Training &amp; Accuracy</span>
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewFormat('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewFormat === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewFormat === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Table
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: PREDICTED MACHINES CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search input */}
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Machine ID (e.g. M14860)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="Stop — Unsafe">🔴 Stop — Unsafe</option>
                <option value="Needs Attention">🟡 Needs Attention</option>
                <option value="Ready">🟢 Ready</option>
              </select>

              {/* Failure mode filter */}
              <select
                value={failureTypeFilter}
                onChange={(e) => setFailureTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Failure Modes</option>
                <option value="TWF">Tool Wear Failure (TWF)</option>
                <option value="HDF">Heat Dissipation (HDF)</option>
                <option value="PWF">Power Anomaly (PWF)</option>
                <option value="OSF">Overstrain Failure (OSF)</option>
                <option value="RNF">Random Failure (RNF)</option>
                <option value="No Failure">No Failure</option>
              </select>

              {/* Variant filter */}
              <select
                value={variantFilter}
                onChange={(e) => setVariantFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Machine Grades (H/M/L)</option>
                <option value="H">H — Heavy Duty (20%)</option>
                <option value="M">M — Medium Grade (30%)</option>
                <option value="L">L — Standard Grade (50%)</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== 'all' || failureTypeFilter !== 'all' || variantFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setFailureTypeFilter('all');
                  setVariantFilter('all');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Machine Grid View (Cards) */}
          {viewFormat === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMachines.map((machine) => {
                const isUnsafe = machine.status === 'Stop — Unsafe';
                const isAttention = machine.status === 'Needs Attention';

                return (
                  <div
                    key={machine.machineId}
                    className={`rounded-2xl p-5 border transition-all duration-150 flex flex-col justify-between shadow-xs ${
                      isUnsafe
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/80 hover:border-rose-400'
                        : isAttention
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/80 hover:border-amber-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Machine Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                              {machine.machineId}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Grade {machine.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            UDI #{machine.udi}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-2xs ${
                            isUnsafe
                              ? 'bg-rose-600 text-white'
                              : isAttention
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          <span>{isUnsafe ? '🔴' : isAttention ? '🟡' : '🟢'}</span>
                          <span>{machine.status}</span>
                        </div>
                      </div>

                      {/* Predicted Failure Mode Banner */}
                      <div className="mt-3.5 p-3 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-300">
                            {machine.failureNameSimple}
                          </span>
                          <span
                            className={`font-mono tabular-nums ${
                              isUnsafe
                                ? 'text-rose-600 dark:text-rose-400'
                                : isAttention
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {machine.failureProbability}% risk
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {machine.plainLanguageReason}
                        </p>
                      </div>

                      {/* Sensor Readings Grid */}
                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] text-slate-400 font-medium">Tool Wear</div>
                          <div
                            className={`text-xs font-black font-mono mt-0.5 ${
                              machine.rawTelemetry.toolWearMin >= 200
                                ? 'text-rose-600 dark:text-rose-400'
                                : machine.rawTelemetry.toolWearMin >= 170
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {machine.rawTelemetry.toolWearMin} m
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] text-slate-400 font-medium">Power</div>
                          <div
                            className={`text-xs font-black font-mono mt-0.5 ${
                              machine.calculatedPowerW > 9000 || machine.calculatedPowerW < 3500
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {machine.calculatedPowerW} W
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] text-slate-400 font-medium">Temp Diff</div>
                          <div
                            className={`text-xs font-black font-mono mt-0.5 ${
                              machine.calculatedDeltaTK < 8.6
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {machine.calculatedDeltaTK} K
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operator Action Button (Plain English) */}
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedMachine(machine)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isUnsafe
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : isAttention
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <span>Check Machine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Machine Table View */}
          {viewFormat === 'table' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Machine ID</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Predicted Failure</th>
                      <th className="p-3">Risk %</th>
                      <th className="p-3">Tool Wear</th>
                      <th className="p-3">Speed</th>
                      <th className="p-3">Torque</th>
                      <th className="p-3">Spindle Power</th>
                      <th className="p-3">Temp Diff</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {filteredMachines.map((m) => (
                      <tr
                        key={m.machineId}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'Stop — Unsafe'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : m.status === 'Needs Attention'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {m.status === 'Stop — Unsafe' ? '🔴 Unsafe' : m.status === 'Needs Attention' ? '🟡 Attention' : '🟢 Ready'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {m.machineId}
                        </td>
                        <td className="p-3">{m.type}</td>
                        <td className="p-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                          {m.predictedFailureType === 'No Failure' ? 'Normal' : m.predictedFailureType}
                        </td>
                        <td className="p-3 font-bold">{m.failureProbability}%</td>
                        <td className="p-3">{m.rawTelemetry.toolWearMin} m</td>
                        <td className="p-3">{m.rawTelemetry.rotationalSpeedRpm} rpm</td>
                        <td className="p-3">{m.rawTelemetry.torqueNm} Nm</td>
                        <td className="p-3">{m.calculatedPowerW} W</td>
                        <td className="p-3">{m.calculatedDeltaTK} K</td>
                        <td className="p-3 text-right font-sans">
                          <button
                            onClick={() => setSelectedMachine(m)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-[11px]"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEST ANY MACHINE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Machine Failure Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust machine sensor telemetry to see how the trained AI predicts failures in real-time.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Preset: Normal Safe
                  setSimVariant('M');
                  setSimAirTempK(298.1);
                  setSimProcessTempK(308.6);
                  setSimSpeedRpm(1550);
                  setSimTorqueNm(42.0);
                  setSimToolWearMin(30);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Preset: 🟢 Safe
              </button>
              <button
                onClick={() => {
                  // Preset: Tool Wear Failure
                  setSimVariant('L');
                  setSimAirTempK(298.4);
                  setSimProcessTempK(308.2);
                  setSimSpeedRpm(1412);
                  setSimTorqueNm(52.3);
                  setSimToolWearMin(225);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
              >
                Preset: 🔴 Tool Wear
              </button>
              <button
                onClick={() => {
                  // Preset: Heat Dissipation Failure
                  setSimVariant('L');
                  setSimAirTempK(299.5);
                  setSimProcessTempK(307.2);
                  setSimSpeedRpm(1290);
                  setSimTorqueNm(58.0);
                  setSimToolWearMin(110);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100"
              >
                Preset: 🔴 Heat Overheat
              </button>
              <button
                onClick={() => {
                  // Preset: Power Anomaly
                  setSimVariant('M');
                  setSimAirTempK(298.4);
                  setSimProcessTempK(308.2);
                  setSimSpeedRpm(1205);
                  setSimTorqueNm(75.0);
                  setSimToolWearMin(120);
                }}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100"
              >
                Preset: 🔴 Power Overload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Sliders */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Machine Quality Variant
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['L', 'M', 'H'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSimVariant(v)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        simVariant === v
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v} - {v === 'L' ? 'Low' : v === 'M' ? 'Medium' : 'Heavy-Duty'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Wear Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Tool Wear:</span>
                  <span className="font-mono text-indigo-600 font-bold">{simToolWearMin} min (Limit: 200m)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={simToolWearMin}
                  onChange={(e) => setSimToolWearMin(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Torque Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Torque:</span>
                  <span className="font-mono text-indigo-600 font-bold">{simTorqueNm} Nm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="0.5"
                  value={simTorqueNm}
                  onChange={(e) => setSimTorqueNm(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Spindle Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Spindle Speed:</span>
                  <span className="font-mono text-indigo-600 font-bold">{simSpeedRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="1150"
                  max="2900"
                  step="10"
                  value={simSpeedRpm}
                  onChange={(e) => setSimSpeedRpm(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Temperatures */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Air Temp:</span>
                    <span className="font-mono text-indigo-600 font-bold">{simAirTempK} K</span>
                  </div>
                  <input
                    type="range"
                    min="295"
                    max="305"
                    step="0.1"
                    value={simAirTempK}
                    onChange={(e) => setSimAirTempK(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Process Temp:</span>
                    <span className="font-mono text-indigo-600 font-bold">{simProcessTempK} K</span>
                  </div>
                  <input
                    type="range"
                    min="304"
                    max="315"
                    step="0.1"
                    value={simProcessTempK}
                    onChange={(e) => setSimProcessTempK(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Live Prediction Output Card */}
            <div
              className={`p-6 rounded-2xl border flex flex-col justify-between shadow-sm ${
                simPrediction.status === 'Stop — Unsafe'
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                  : simPrediction.status === 'Needs Attention'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                    Live Model Prediction
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-2xs ${
                      simPrediction.status === 'Stop — Unsafe'
                        ? 'bg-rose-600 text-white'
                        : simPrediction.status === 'Needs Attention'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <span>{simPrediction.status === 'Stop — Unsafe' ? '🔴' : simPrediction.status === 'Needs Attention' ? '🟡' : '🟢'}</span>
                    <span>{simPrediction.status}</span>
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {simPrediction.failureNameSimple}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    Risk Probability: <span className="font-mono font-bold">{simPrediction.failureProbability}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Plain-Language Explanation:
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {simPrediction.plainLanguageReason}
                  </p>
                </div>

                {/* Physics Derived Quantities */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Spindle Power</div>
                    <div className="font-bold font-mono mt-0.5">{simPrediction.calculatedPowerW} W</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Temp Diff (ΔT)</div>
                    <div className="font-bold font-mono mt-0.5">{simPrediction.calculatedDeltaTK} K</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Overstrain</div>
                    <div className="font-bold font-mono mt-0.5">{simPrediction.calculatedOverstrain}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recommended Operator Action:
                </div>
                <div
                  className={`p-3 rounded-xl font-bold text-xs flex items-center gap-2 ${
                    simPrediction.status === 'Stop — Unsafe'
                      ? 'bg-rose-600 text-white'
                      : simPrediction.status === 'Needs Attention'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{simPrediction.plainLanguageAction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MODEL TRAINING & ACCURACY */}
      {activeTab === 'training' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Machine Learning Model Training &amp; Benchmarks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trained on the 10,000-record AI4I 2020 Predictive Maintenance Dataset
              </p>
            </div>

            <button
              onClick={handleRetrainModel}
              disabled={isRetraining}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs self-start sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{isRetraining ? 'Training Model...' : 'Re-Train Model'}</span>
            </button>
          </div>

          {retrainSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              {retrainSuccessMsg}
            </div>
          )}

          {/* Model Metrics 4-Pack */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Accuracy</div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                {trainingMetrics.trainedAccuracy}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Across 10,000 instances</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Precision</div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {trainingMetrics.precision}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Minimal false alarms</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Recall / Sensitivity</div>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                {trainingMetrics.recall}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Catches genuine defects</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">F1-Score</div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                {trainingMetrics.f1Score}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Balanced harmonic mean</div>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Confusion Matrix (10,000 Records)
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <div className="text-[10px] text-slate-500 font-sans">True Negatives (TN)</div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    {trainingMetrics.confusionMatrix.trueNegatives}
                  </div>
                  <div className="text-[9px] text-slate-400">Normal correctly predicted</div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                  <div className="text-[10px] text-slate-500 font-sans">False Positives (FP)</div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                    {trainingMetrics.confusionMatrix.falsePositives}
                  </div>
                  <div className="text-[9px] text-slate-400">False alarms</div>
                </div>

                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                  <div className="text-[10px] text-slate-500 font-sans">False Negatives (FN)</div>
                  <div className="text-xl font-bold text-rose-700 dark:text-rose-400 mt-1">
                    {trainingMetrics.confusionMatrix.falseNegatives}
                  </div>
                  <div className="text-[9px] text-slate-400">Missed defects</div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <div className="text-[10px] text-slate-500 font-sans">True Positives (TP)</div>
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mt-1">
                    {trainingMetrics.confusionMatrix.truePositives}
                  </div>
                  <div className="text-[9px] text-slate-400">Correctly caught failures</div>
                </div>
              </div>
            </div>

            {/* Hyperparameter Sensitivity Tuning */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Model Threshold Calibration
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Decision Threshold Cutoff:</span>
                  <span className="font-mono font-bold text-indigo-600">{modelConfig.decisionThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={modelConfig.decisionThreshold}
                  onChange={(e) =>
                    setModelConfig({ ...modelConfig, decisionThreshold: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600"
                />
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>More Sensitive (Fewer Misses)</span>
                  <span>More Conservative (Fewer Alarms)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Tool Wear Failure Limit:</span>
                  <span className="font-mono font-bold text-indigo-600">{modelConfig.toolWearLimitMin} min</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="240"
                  value={modelConfig.toolWearLimitMin}
                  onChange={(e) =>
                    setModelConfig({ ...modelConfig, toolWearLimitMin: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Heat Dissipation Threshold:</span>
                  <span className="font-mono font-bold text-indigo-600">{modelConfig.heatDissipationThresholdK} K</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="10.5"
                  step="0.1"
                  value={modelConfig.heatDissipationThresholdK}
                  onChange={(e) =>
                    setModelConfig({
                      ...modelConfig,
                      heatDissipationThresholdK: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT MACHINE / OPERATOR ACTION MODAL */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {selectedMachine.machineId}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Grade {selectedMachine.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  UDI #{selectedMachine.udi} • Detailed Machine Inspection
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMachine(null);
                  setOperatorActionDone(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status Banner */}
            <div
              className={`p-4 rounded-2xl flex items-center justify-between ${
                selectedMachine.status === 'Stop — Unsafe'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                  : selectedMachine.status === 'Needs Attention'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider">
                  Assigned Machine Status
                </div>
                <div className="text-lg font-black mt-0.5">
                  {selectedMachine.status}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xl font-black">{selectedMachine.failureProbability}%</div>
                <div className="text-[10px] opacity-80">Risk Score</div>
              </div>
            </div>

            {/* Plain-Language Explanation */}
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-[10px]">
                Why was this flagged? (Plain English)
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {selectedMachine.plainLanguageReason}
              </p>
            </div>

            {/* Risk Contribution Breakdown */}
            <div className="space-y-2">
              <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-[10px]">
                Sensor Readings &amp; Safety Limits
              </div>
              <div className="space-y-1.5 text-xs">
                {selectedMachine.riskContributions.map((r) => (
                  <div
                    key={r.feature}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {r.feature}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {r.value}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.impact === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold'
                          : r.impact === 'Warning'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {r.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            {operatorActionDone ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{operatorActionDone}</span>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setOperatorActionDone(
                      `Action confirmed: ${selectedMachine.plainLanguageAction}. Work order logged and maintenance team notified.`
                    );
                  }}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
                    selectedMachine.status === 'Stop — Unsafe'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : selectedMachine.status === 'Needs Attention'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Perform Action: {selectedMachine.plainLanguageAction}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
