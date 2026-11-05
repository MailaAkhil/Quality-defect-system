import React from 'react';
import {
  Workflow,
  Database,
  Cpu,
  CheckCircle,
} from 'lucide-react';

export const SystemSpec: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Quality Control Defect Prediction System
        </h2>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="text-xs font-bold font-mono text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
            System Mission & Overview
          </div>
          Manual quality inspection on production lines is slow and inconsistent, allowing defective products to reach customers.
          This system predicts defect likelihood from real-time production process parameters, automating triage workflows and providing quality analytics dashboards.
        </div>
      </div>

      {/* Objectives & Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Core System Objectives</span>
          </h3>

          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Log production process parameters per batch:</strong> Temperature, pressure, vibration, cycle time, machine speed, and ambient conditions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Predict probability of defects per batch:</strong> Machine learning inference calculates continuous likelihood and identifies root-cause failure modes.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Flag high-risk batches for inspection:</strong> Automated triage routes batches exceeding quality limits directly into the physical NDT queue.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Track inspection outcomes for model feedback:</strong> Ground truth disposition records feed back into the classifier to retune weights.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Provide quality analytics dashboards:</strong> Pareto defect analysis, first-pass yield tracking, and SPC process limits.
              </span>
            </li>
          </ul>
        </div>

        {/* Flowchart Diagram */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Operational Flowchart</span>
          </h3>

          <div className="flex flex-col items-center space-y-2 py-2 text-xs font-mono">
            <div className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold shadow-2xs">
              Quality Officer / Admin / Employee
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="w-64 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-semibold shadow-2xs">
              Secure Sign In
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="w-64 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-semibold shadow-2xs">
              Enter Machine Readings
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="w-64 py-2 text-center rounded-xl bg-indigo-600 text-white font-bold shadow-xs">
              Defect Prediction Engine
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="w-64 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-semibold shadow-2xs">
              Inspection Workflow
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="w-64 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-semibold shadow-2xs">
              Analytics Dashboard
            </div>
            <div className="text-slate-400 dark:text-slate-600">↓</div>
            <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow-2xs">
              Output / Dashboard Reports
            </div>
          </div>
        </div>
      </div>

      {/* Dataset & Integrations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Dataset Specification</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <strong>Kaggle Manufacturing Quality/Defect Prediction Dataset</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Feature Count:</span>
              <div className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">8 Sensor Channels</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Target Variable:</span>
              <div className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">Defect Likelihood (0 - 100%)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Class Defect Categories:</span>
              <div className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">5 Failure Typologies</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Core Engineering Modules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-indigo-700 dark:text-indigo-400">Machine Learning</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Calibrated classification model with non-linear cross-parameter penalties & SHAP feature attribution.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-indigo-700 dark:text-indigo-400">Full Stack System</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Quality-control dashboard with role-based access control and left-side module navigation.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-indigo-700 dark:text-indigo-400">Software Engineering</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Modular services, robust TypeScript contracts, documented data schemas, and zero-dead-clicks state management.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-indigo-700 dark:text-indigo-400">Operating Systems</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Concurrent multi-threaded batch ingestion engine simulating asynchronous sensor pipeline execution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
