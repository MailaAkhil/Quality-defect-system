import React, { useState } from 'react';
import {
  BatchItem,
  DefectType,
  Disposition,
  InspectionStatus,
  User,
} from '../types';
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  ShieldCheck,
} from 'lucide-react';

interface InspectionWorkflowProps {
  batches: BatchItem[];
  selectedBatchId?: string;
  onSelectBatch: (batchId: string) => void;
  onSubmitInspection: (
    batchId: string,
    updates: {
      status: InspectionStatus;
      inspectorName: string;
      visualCheckPassed: boolean;
      dimensionalTolerancePassed: boolean;
      ultrasonicNDTPassed: boolean;
      surfaceRoughnessPassed: boolean;
      actualDefectFound: DefectType;
      actualDisposition: Disposition;
      inspectorNotes: string;
    }
  ) => void;
  currentUser: User;
}

export const InspectionWorkflow: React.FC<InspectionWorkflowProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onSubmitInspection,
  currentUser,
}) => {
  // Flagged batches requiring inspection
  const flaggedBatches = batches.filter((b) => b.prediction.flaggedForInspection);
  const pendingFlagged = flaggedBatches.filter((b) => b.inspection.status === 'pending');
  const completedInspections = batches.filter((b) => b.inspection.status !== 'pending');

  const activeBatch =
    batches.find((b) => b.id === selectedBatchId) ||
    pendingFlagged[0] ||
    flaggedBatches[0] ||
    batches[0];

  // Inspection form states
  const [visualCheck, setVisualCheck] = useState<boolean>(true);
  const [dimensionalCheck, setDimensionalCheck] = useState<boolean>(true);
  const [ultrasonicCheck, setUltrasonicCheck] = useState<boolean>(true);
  const [roughnessCheck, setRoughnessCheck] = useState<boolean>(true);
  const [actualDefect, setActualDefect] = useState<DefectType>('None');
  const [disposition, setDisposition] = useState<Disposition>('Approved');
  const [notes, setNotes] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Sync state if selected batch is already inspected
  React.useEffect(() => {
    if (activeBatch && activeBatch.inspection.status !== 'pending') {
      setVisualCheck(activeBatch.inspection.visualCheckPassed);
      setDimensionalCheck(activeBatch.inspection.dimensionalTolerancePassed);
      setUltrasonicCheck(activeBatch.inspection.ultrasonicNDTPassed);
      setRoughnessCheck(activeBatch.inspection.surfaceRoughnessPassed);
      setActualDefect(activeBatch.inspection.actualDefectFound);
      setDisposition(activeBatch.inspection.actualDisposition);
      setNotes(activeBatch.inspection.inspectorNotes || '');
    } else if (activeBatch) {
      // Default to ML prediction expectation
      const hasPredictedDefect = activeBatch.prediction.defectProbability > 50;
      setVisualCheck(!hasPredictedDefect);
      setDimensionalCheck(!hasPredictedDefect);
      setUltrasonicCheck(!hasPredictedDefect);
      setRoughnessCheck(!hasPredictedDefect);
      setActualDefect(hasPredictedDefect ? activeBatch.prediction.predictedDefectType : 'None');
      setDisposition(hasPredictedDefect ? 'Scrap' : 'Approved');
      setNotes('');
    }
    setFeedbackSuccess(false);
  }, [activeBatch?.id]);

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) return;

    const isDefectFound = actualDefect !== 'None' || !visualCheck || !dimensionalCheck || !ultrasonicCheck || !roughnessCheck;
    const finalStatus: InspectionStatus = isDefectFound ? 'failed' : 'passed';

    onSubmitInspection(activeBatch.id, {
      status: finalStatus,
      inspectorName: currentUser.name,
      visualCheckPassed: visualCheck,
      dimensionalTolerancePassed: dimensionalCheck,
      ultrasonicNDTPassed: ultrasonicCheck,
      surfaceRoughnessPassed: roughnessCheck,
      actualDefectFound: actualDefect,
      actualDisposition: disposition,
      inspectorNotes: notes,
    });

    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
    }, 3500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Top Banner: Workflow Triage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Batches in Triage Queue</div>
            <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
              {pendingFlagged.length}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Awaiting physical verification</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Flagged Batches</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {flaggedBatches.length}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Automated ML risk triage</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Model Feedback Loop</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
              ACTIVE
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Continuous weights retraining</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
            <RotateCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Queue Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Inspection Queue
              </span>
              <span className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900">
                {pendingFlagged.length} Pending
              </span>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {pendingFlagged.map((batch) => {
                const isSelected = batch.id === activeBatch?.id;
                return (
                  <div
                    key={batch.id}
                    onClick={() => onSelectBatch(batch.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {batch.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {batch.prediction.defectProbability}% Defect Risk
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Line: {batch.parameters.productLine}
                    </div>

                    <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono font-semibold mt-1">
                      Predicted: {batch.prediction.predictedDefectType}
                    </div>
                  </div>
                );
              })}

              {pendingFlagged.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  All flagged batches currently inspected! Check completed tab below or stream new batch.
                </div>
              )}

              {/* Previously Inspected Header */}
              {completedInspections.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">
                    Verified Batches (History)
                  </div>
                  {completedInspections.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => onSelectBatch(b.id)}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center justify-between mb-1.5 cursor-pointer"
                    >
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{b.id}</span>
                      <span
                        className={`font-bold ${
                          b.inspection.status === 'failed' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {b.inspection.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Physical Quality Inspection Workbench */}
        {activeBatch ? (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>Physical Inspection Station</span>
                  <span>·</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{activeBatch.parameters.productLine}</span>
                </div>
                <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {activeBatch.id}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">ML Predicted Risk</div>
                <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  {activeBatch.prediction.defectProbability}% · {activeBatch.prediction.predictedDefectType}
                </div>
              </div>
            </div>

            {/* Hardware Optical Inspection Image Slot */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 group shadow-xs">
              <img
                src="/src/assets/images/industrial_inspection_station_1790762146481.jpg"
                alt="Automated Optical & NDT Inspection Bench"
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover filter brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <div className="font-mono text-indigo-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  STATION 04: NON-DESTRUCTIVE TESTING BENCH
                </div>
                <div className="font-mono text-white/90">
                  Officer: {currentUser.name}
                </div>
              </div>
            </div>

            {/* Inspection Checklist & Outcome Form */}
            <form onSubmit={handleSaveInspection} className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Physical Quality Check Protocol
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Visual Check */}
                  <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Optical & Visual Surface Inspection
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Check for surface blemishes, discoloration & flash
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visualCheck}
                      onChange={(e) => setVisualCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                  </label>

                  {/* Dimensional Check */}
                  <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        CMM Dimensional Tolerance Calibration
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Tolerances within ±0.015mm ISO 2768
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dimensionalCheck}
                      onChange={(e) => setDimensionalCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                  </label>

                  {/* Ultrasonic NDT Check */}
                  <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ultrasonic NDT Void / Crack Scan
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Subsurface density & porosity attenuation test
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ultrasonicCheck}
                      onChange={(e) => setUltrasonicCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                  </label>

                  {/* Surface Roughness Check */}
                  <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Surface Profilometry (Ra &le; 1.6μm)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Ensures micro-finish requirements are met
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={roughnessCheck}
                      onChange={(e) => setRoughnessCheck(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                  </label>
                </div>
              </div>

              {/* Actual Outcome Logging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirmed Defect Type (Ground Truth)
                  </label>
                  <select
                    value={actualDefect}
                    onChange={(e) => setActualDefect(e.target.value as DefectType)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  >
                    <option value="None">None (No Defect Confirmed)</option>
                    <option value="Micro-Cracking">Micro-Cracking</option>
                    <option value="Porosity Void">Porosity Void</option>
                    <option value="Dimensional Warpage">Dimensional Warpage</option>
                    <option value="Surface Roughness">Surface Roughness</option>
                    <option value="Incomplete Fusion">Incomplete Fusion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Batch Disposition Action
                  </label>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value as Disposition)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  >
                    <option value="Approved">Approved for Shipping</option>
                    <option value="Rework Required">Rework Required (Secondary Machining)</option>
                    <option value="Scrap">Scrap / Melt Recycle</option>
                    <option value="Engineering Review">Engineering Hold / Metallurgy Lab</option>
                  </select>
                </div>
              </div>

              {/* Inspector Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inspection Findings & Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record observations, micro-fracture coordinates, or calibration notes..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Feedback Success Notification */}
              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Outcome recorded! Machine Learning weights tuned with this ground-truth feedback.
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Trains continuous feedback calibration</span>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Submit Inspection & Feedback to Model</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            Select a batch to begin inspection.
          </div>
        )}
      </div>
    </div>
  );
};
