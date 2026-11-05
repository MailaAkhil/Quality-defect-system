import React, { useState, useEffect } from 'react';
import {
  BatchItem,
  DefectType,
  Disposition,
  InspectionStatus,
  User,
} from '../../types';
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  ShieldCheck,
  ArrowRight,
  Eye,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Filter,
  Check,
  X,
  Cog,
} from 'lucide-react';
import { PlainEnglishAssistant } from '../common/PlainEnglishAssistant';
import { DomainIntegrationSection } from '../common/DomainIntegrationSection';

interface OfficerDashboardProps {
  batches: BatchItem[];
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onSubmitInspection: (
    batchId: string,
    results: {
      status: InspectionStatus;
      actualDefectFound: DefectType;
      actualDisposition: Disposition;
      visualCheckPassed: boolean;
      dimensionalTolerancePassed: boolean;
      ultrasonicNDTPassed: boolean;
      surfaceRoughnessPassed: boolean;
      inspectorNotes: string;
    }
  ) => void;
  currentUser: User;
  onNavigateToQueue: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onSubmitInspection,
  currentUser,
  onNavigateToQueue,
  onNavigateSection,
}) => {
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Local state for the 4 physical tests
  const [visualCheckPassed, setVisualCheckPassed] = useState<boolean>(
    currentBatch ? currentBatch.inspection.visualCheckPassed : true
  );
  const [dimensionalTolerancePassed, setDimensionalTolerancePassed] = useState<boolean>(
    currentBatch ? currentBatch.inspection.dimensionalTolerancePassed : true
  );
  const [ultrasonicNDTPassed, setUltrasonicNDTPassed] = useState<boolean>(
    currentBatch ? currentBatch.inspection.ultrasonicNDTPassed : true
  );
  const [surfaceRoughnessPassed, setSurfaceRoughnessPassed] = useState<boolean>(
    currentBatch ? currentBatch.inspection.surfaceRoughnessPassed : true
  );

  const [actualDefectFound, setActualDefectFound] = useState<DefectType>(
    currentBatch ? currentBatch.inspection.actualDefectFound : 'None'
  );
  const [actualDisposition, setActualDisposition] = useState<Disposition>(
    currentBatch ? currentBatch.inspection.actualDisposition : 'Approved'
  );
  const [inspectorNotes, setInspectorNotes] = useState<string>(
    currentBatch?.inspection.inspectorNotes || ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'pending' | 'all'>('pending');
  const [showScrapConfirmModal, setShowScrapConfirmModal] = useState<boolean>(false);

  // Sync state whenever active batch changes
  useEffect(() => {
    if (currentBatch) {
      setVisualCheckPassed(currentBatch.inspection.visualCheckPassed);
      setDimensionalTolerancePassed(currentBatch.inspection.dimensionalTolerancePassed);
      setUltrasonicNDTPassed(currentBatch.inspection.ultrasonicNDTPassed);
      setSurfaceRoughnessPassed(currentBatch.inspection.surfaceRoughnessPassed);
      setActualDefectFound(currentBatch.inspection.actualDefectFound);
      setActualDisposition(currentBatch.inspection.actualDisposition);
      setInspectorNotes(currentBatch.inspection.inspectorNotes || '');
    }
  }, [currentBatch?.id]);

  const flaggedQueue = batches.filter(
    (b) => b.prediction.flaggedForInspection && b.inspection.status === 'pending'
  );
  const inspectedCount = batches.filter((b) => b.inspection.status !== 'pending').length;
  const verifiedDefects = batches.filter((b) => b.inspection.actualDefectFound !== 'None').length;

  // 1-Click Fast Pass (All Tests Passed)
  const handleFastApproveAll = () => {
    setVisualCheckPassed(true);
    setDimensionalTolerancePassed(true);
    setUltrasonicNDTPassed(true);
    setSurfaceRoughnessPassed(true);
    setActualDefectFound('None');
    setActualDisposition('Approved');
  };

  // 1-Click Fast Defect Mark
  const handleFastMarkDefect = () => {
    setVisualCheckPassed(false);
    setUltrasonicNDTPassed(false);
    setActualDefectFound(currentBatch?.prediction.predictedDefectType || 'Micro-Cracking');
    setActualDisposition('Rework Required');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBatch) return;

    setIsSubmitting(true);
    const allPassed =
      visualCheckPassed &&
      dimensionalTolerancePassed &&
      ultrasonicNDTPassed &&
      surfaceRoughnessPassed &&
      actualDefectFound === 'None';

    const status: InspectionStatus = allPassed ? 'passed' : 'failed';

    setTimeout(() => {
      onSubmitInspection(currentBatch.id, {
        status,
        actualDefectFound,
        actualDisposition,
        visualCheckPassed,
        dimensionalTolerancePassed,
        ultrasonicNDTPassed,
        surfaceRoughnessPassed,
        inspectorNotes:
          inspectorNotes ||
          `Checked & signed off by ${currentUser.name} (${status.toUpperCase()}) on ${new Date().toLocaleTimeString()}`,
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 3000);
    }, 250);
  };

  const displayedBatches =
    filterMode === 'pending'
      ? batches.filter((b) => b.prediction.flaggedForInspection && b.inspection.status === 'pending')
      : batches;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-150">
      {/* 1. TOP HERO: Plain English Quality Review Status */}
      <div className="rounded-3xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-2xs">
                Quality Inspection Station
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Safety guard working</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {flaggedQueue.length > 0 ? '🟡 Needs Attention' : '🟢 Ready'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Inspector: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Cog className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-[spin_15s_linear_infinite]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {flaggedQueue.length > 0
                  ? `${flaggedQueue.length} Batches Waiting for Quality Review`
                  : 'All Flagged Batches Successfully Inspected!'}
              </h1>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Pick a batch from the left list, perform the 4 simple tests, and click Approve or Rework.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToQueue}
              className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-slate-50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <span>Items Waiting for Review ({flaggedQueue.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE SUMMARY CARDS (Fast Glance) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Waiting for Check</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              {flaggedQueue.length} Batches
            </div>
            <div className="text-[11px] text-slate-400">High priority review</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Inspected Today</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {inspectedCount} Batches
            </div>
            <div className="text-[11px] text-slate-400">Successfully tested & recorded</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Defects Caught</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
              {verifiedDefects} Items
            </div>
            <div className="text-[11px] text-slate-400">Saved from shipping out</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKBENCH: Left Column = List, Right Column = Inspection Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Select Batch to Inspect */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-[340px] sm:h-[420px] lg:h-[680px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose a Batch</h3>
              <p className="text-[11px] text-slate-500">Click any batch to inspect</p>
            </div>

            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterMode('pending')}
                className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                  filterMode === 'pending'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Needs Review ({flaggedQueue.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                All ({batches.length})
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
            {displayedBatches.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                No batches waiting for check!
              </div>
            ) : (
              displayedBatches.map((batch) => {
                const isSelected = batch.id === currentBatch?.id;
                const isPending =
                  batch.prediction.flaggedForInspection && batch.inspection.status === 'pending';
                const isPassed = batch.inspection.status === 'passed';

                return (
                  <button
                    key={batch.id}
                    onClick={() => onSelectBatch(batch.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {batch.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isPending ? 'Needs Review' : isPassed ? 'Approved' : 'Failed'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {batch.parameters.productLine}
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2 font-mono">
                      <span className="text-slate-400">Risk:</span>
                      <span
                        className={`font-bold ${
                          batch.prediction.defectProbability > 50
                            ? 'text-rose-600'
                            : batch.prediction.defectProbability > 25
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {batch.prediction.defectProbability}%
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Inspection Checklist & Approval */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {currentBatch ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Batch Context Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Inspecting Batch:</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {currentBatch.id}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {currentBatch.parameters.productLine} · Alloy: {currentBatch.parameters.materialGrade}
                  </div>
                </div>

                {/* AI Warning Summary in Plain English */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 text-xs space-y-1">
                  <div className="text-slate-500">AI Risk Assessment:</div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        currentBatch.prediction.defectProbability > 45 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                    {currentBatch.prediction.defectProbability}% Risk -{' '}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      Possible {currentBatch.prediction.predictedDefectType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast 1-Click Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-500 font-bold">Fast Fill:</span>
                <button
                  type="button"
                  onClick={handleFastApproveAll}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Pass All Tests & Approve
                </button>

                <button
                  type="button"
                  onClick={handleFastMarkDefect}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 cursor-pointer transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Mark Defective & Send to Rework
                </button>
              </div>

              {/* The 4 Physical Tests - Plain English Cards */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  4 Mandatory Physical Verification Tests
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Test 1: Visual Check */}
                  <div
                    onClick={() => setVisualCheckPassed(!visualCheckPassed)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                      visualCheckPassed
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        1. Visual Surface Look
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          visualCheckPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {visualCheckPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Check surface for burns, cracks, or deep scratches.
                    </p>
                  </div>

                  {/* Test 2: Dimensions */}
                  <div
                    onClick={() => setDimensionalTolerancePassed(!dimensionalTolerancePassed)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                      dimensionalTolerancePassed
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        2. Exact Size & Blueprint
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          dimensionalTolerancePassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {dimensionalTolerancePassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Measure length, width, and holes with digital calipers.
                    </p>
                  </div>

                  {/* Test 3: Ultrasound Scan */}
                  <div
                    onClick={() => setUltrasonicNDTPassed(!ultrasonicNDTPassed)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                      ultrasonicNDTPassed
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        3. Ultrasound Sound Scan
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          ultrasonicNDTPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {ultrasonicNDTPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Check inside the metal for hidden voids or bubbles.
                    </p>
                  </div>

                  {/* Test 4: Surface Smoothness */}
                  <div
                    onClick={() => setSurfaceRoughnessPassed(!surfaceRoughnessPassed)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                      surfaceRoughnessPassed
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        4. Smoothness Finish
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          surfaceRoughnessPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {surfaceRoughnessPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Check surface roughness meets customer standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Disposition & Defect Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Found Any Real Defect?
                  </label>
                  <select
                    value={actualDefectFound}
                    onChange={(e) => setActualDefectFound(e.target.value as DefectType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="None">None (Part is Good)</option>
                    <option value="Micro-Cracking">Micro-Cracking</option>
                    <option value="Porosity">Porosity / Air Holes</option>
                    <option value="Dimensional Drift">Dimensional Drift / Wrong Size</option>
                    <option value="Surface Roughness">Excessive Roughness</option>
                    <option value="Thermal Distortion">Thermal Distortion / Warped</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Final Disposition Decision
                  </label>
                  <select
                    value={actualDisposition}
                    onChange={(e) => setActualDisposition(e.target.value as Disposition)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Approved">Approved (Ready to Ship)</option>
                    <option value="Rework Required">Rework Required (Fix on Machine)</option>
                    <option value="Quarantined">Quarantined (Under Review)</option>
                    <option value="Scrap">Scrap (Cannot be fixed, discard)</option>
                  </select>
                </div>
              </div>

              {/* Inspector Notes */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                  Inspector Notes / Comments
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified with digital micrometer; surface is smooth and ready."
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Submit Button & Confirmation */}
              {submissionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Decision saved! AI model has been updated with your verification data.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Saving Inspection...'
                    : `Submit Decision: ${actualDisposition.toUpperCase()}`}
                </span>
              </button>
            </form>
          ) : (
            <div className="py-20 text-center text-slate-400 text-sm">
              Please select a batch from the left list to begin inspection.
            </div>
          )}
        </div>
      </div>

      {/* Domain Integration (Machine Learning, Full Stack, Software Engineering, Operating Systems) */}
      <DomainIntegrationSection
        variant="banner"
        onNavigateSection={onNavigateSection}
      />

      {/* NLP Assistant */}
      <PlainEnglishAssistant
        flaggedCount={flaggedQueue.length}
        totalBatches={batches.length}
        roleTitle="Quality Officer"
      />

      {/* Critical Action: Scrap Confirmation Modal */}
      {showScrapConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Confirm Part Scrap Decision</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScrapConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to declare <strong>{currentBatch?.id}</strong> as <strong>SCRAP</strong>? Scrapped material cannot be recovered and will be logged in the permanent audit trail.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowScrapConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowScrapConfirmModal(false);
                  const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleSubmit(fakeEvent);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Scrap Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
