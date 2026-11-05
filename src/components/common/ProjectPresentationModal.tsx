import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Users,
  ShieldCheck,
  ClipboardCheck,
  HardHat,
  Cpu,
  Layers,
  Database,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gauge,
  Activity,
  Download,
  Share2,
  Eye,
  Sliders,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface RoleSlide {
  id: number;
  title: string;
  tagline: string;
  targetAudience: 'All Roles' | 'Worker' | 'Quality Officer' | 'Admin';
  badgeColor: string;
  icon: any;
  overview: string;
  keyResponsibilities: string[];
  stepByStepGuide: { step: string; detail: string; visualCue: string }[];
  proTips: string[];
  systemIntegration: string;
}

const SLIDES: RoleSlide[] = [
  {
    id: 1,
    title: 'Machine Quality Check & Defect Prediction Platform',
    tagline: 'Standard Operating Procedures & Complete Role Guide (Worker, Officer, Admin)',
    targetAudience: 'All Roles',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    icon: Presentation,
    overview:
      'An intelligent industrial quality-control system combining Machine Learning (defect predictions), Full Stack operational dashboards, Software Engineering with MySQL persistence, and Operating Systems multi-threaded batch ingestion.',
    keyResponsibilities: [
      'Stop factory defects before finished parts leave assembly lines',
      'Provide zero-jargon, color-coded visual dashboards for shopfloor operators',
      'Empower Quality Officers with calibrated NDT inspection workflows',
      'Give Plant Admins complete visibility over yield rates, scrap reduction, and speed tests',
    ],
    stepByStepGuide: [
      {
        step: '1. Select Your Role',
        detail: 'Log in as Worker (Operator), Quality Officer (Inspector), or Admin (Manager).',
        visualCue: 'Blue sign-in modal with 1-click preset credentials.',
      },
      {
        step: '2. Dedicated Workspace',
        detail: 'The interface instantly adjusts: Operators see dials, Officers see review queues, Admins see plant health.',
        visualCue: 'Left-hand navigation tailored strictly to your duties.',
      },
      {
        step: '3. Closed-Loop AI Learning',
        detail: 'Every officer inspection feeds ground-truth data back to calibrate the machine learning model in real-time.',
        visualCue: 'Continuous accuracy tuning counter in the top bar.',
      },
    ],
    proTips: [
      'Use the Day/Night (White/Dark) toggle in the top bar for optimal shop-floor contrast.',
      'Check the top bar status badge (🟢 All Safe vs 🟡 Needs Attention) at a quick glance.',
      'Access the MySQL button in the header anytime to sync or verify database storage.',
    ],
    systemIntegration:
      'Domain Integration: Combines Machine Learning, Full Stack, Software Engineering, and Operating Systems.',
  },
  {
    id: 2,
    title: '👷 Machine Worker (Trained Operator) Guide',
    tagline: 'How to monitor machine health, enter dial readings, and run safety checks',
    targetAudience: 'Worker',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    icon: HardHat,
    overview:
      'As a shopfloor operator, your priority is keeping the machine running safely in the green zone, performing pre-shift safety checklists, and accurately logging heat, pressure, and vibration readings.',
    keyResponsibilities: [
      'Complete the pre-shift "Machine Setup Check" before engaging motor spindles',
      'Read gauge dials and log temperature, pressure, vibration, and machine speed',
      'Monitor the "Safety Guard Working" status indicator',
      'Immediately trigger Emergency Stop if machine readings enter the red hazard zone',
    ],
    stepByStepGuide: [
      {
        step: 'Step 1: Check Machine Status (Console)',
        detail: 'Open "Machine Status" in your left menu. Confirm the green "Safety guard working" badge is active.',
        visualCue: 'Large live camera feed & status card (🟢 Ready / 🟡 Needs Attention).',
      },
      {
        step: 'Step 2: Complete Morning Setup Check',
        detail: 'Navigate to "Machine Setup Check" (Checklist). Verify safety guards, oil levels, and tool alignment.',
        visualCue: 'Click each checkbox until "Check Machine (All 6 Passed)" turns green.',
      },
      {
        step: 'Step 3: Log Current Dial Readings',
        detail: 'Go to "Enter Machine Readings". Use the range sliders to input temperature (°C), pressure (bar), and vibration (mm/s).',
        visualCue: 'Green zone indicates safe limits; yellow warns of high heat/speed.',
      },
      {
        step: 'Step 4: Submit Part Batch',
        detail: 'Click "Log Today\'s Readings". The ML model immediately predicts defect likelihood.',
        visualCue: 'Success toast confirms batch is saved and synced to MySQL.',
      },
    ],
    proTips: [
      'Normal running temperature is 210°C (safe range 180°C - 230°C). Over 240°C increases defect risk.',
      'Normal pressure is ~4.8 bar. If pressure drops below 3.0 bar, tool chatter may occur.',
      'Ask the plain-English assistant at the bottom: "Is my machine safe?" for instant guidance.',
    ],
    systemIntegration:
      'Worker entries stream into the ML inference engine and save immediately to the MySQL machine_batches table.',
  },
  {
    id: 3,
    title: '🔬 Quality Officer (Inspector) Guide',
    tagline: 'How to review flagged batches, run physical NDT tests, and sign off dispositions',
    targetAudience: 'Quality Officer',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    icon: ClipboardCheck,
    overview:
      'Quality Officers perform non-destructive testing (NDT) on parts flagged by the machine learning algorithm. Your inspection decisions approve parts for shipping, route them to rework, or confirm scrap.',
    keyResponsibilities: [
      'Triage the "Items Waiting for Review" queue flagged by AI predictions',
      'Execute the 4 physical inspection tests: Visual, Dimensions, Ultrasonic NDT, Surface Finish',
      'Select the final disposition: Approved, Rework Required, Scrap, or Engineering Review',
      'Provide ground-truth feedback that continuously trains and refines the ML model',
    ],
    stepByStepGuide: [
      {
        step: 'Step 1: Open Quality Inspection Station',
        detail: 'Navigate to "Quality Inspection Station" (Workbench). View batches flagged with high risk scores.',
        visualCue: 'Flagged counter shows pending parts (e.g. ⚠️ 3 Needs Attention).',
      },
      {
        step: 'Step 2: Select a Batch to Inspect',
        detail: 'Click on a batch card in the left list to load its detailed sensor telemetry and risk contributions.',
        visualCue: 'Center inspection workstation reveals defect probability (e.g. 78% Micro-Cracking).',
      },
      {
        step: 'Step 3: Complete 4 Physical Tests',
        detail: 'Toggle the 4 check cards: Visual Check, Dimensional Tolerance, Ultrasonic NDT, Surface Roughness.',
        visualCue: 'Toggle each switch to Passed (Green) or Failed (Red).',
      },
      {
        step: 'Step 4: Submit Final Disposition',
        detail: 'Select Approved, Rework Required, or Scrap. Click "Submit Decision".',
        visualCue: 'Scrap action requires confirmation dialog to prevent accidental write-offs.',
      },
    ],
    proTips: [
      'Inspect the "Defect Root Cause" view to understand why AI flagged the part (e.g., heat spike + vibration).',
      'Use "Quality Charts & Trends" to identify recurring failure types (e.g., Tool Wear Failure or Heat Dissipation).',
      'Every sign-off updates the system F1 score and false-positive calibration.',
    ],
    systemIntegration:
      'Inspection sign-offs update the closed-loop ML model weights and update the MySQL inspection_status record.',
  },
  {
    id: 4,
    title: '👔 System Admin (Plant Manager) Guide',
    tagline: 'How to monitor factory yield, tune AI thresholds, and benchmark throughput',
    targetAudience: 'Admin',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    icon: ShieldCheck,
    overview:
      'Plant Administrators have comprehensive oversight of overall factory health, yield percentages, cost savings, AI classification sensitivity, and server speed benchmarks.',
    keyResponsibilities: [
      'Monitor Plant Overview & Health metrics (Pass Rate, Scrap Prevented, Total Cost Saved)',
      'Adjust AI Inspection Thresholds (set strictness for flagging parts)',
      'Run multi-threaded OS Speed & Performance Tests (simulate high-volume ingestion)',
      'Audit database storage, security logs, and download complete CSV factory reports',
    ],
    stepByStepGuide: [
      {
        step: 'Step 1: Review Plant Overview & Health',
        detail: 'Check the 4 top metrics: Quality Pass Rate (%), Flagged Queue, Scrap Prevented, and Total Cost Saved.',
        visualCue: 'Live yield rate bar with estimated dollar savings calculation.',
      },
      {
        step: 'Step 2: Machine Setup Check & AI Settings',
        detail: 'Open "Machine Setup Check & AI Settings" (Calibration). Adjust the inspection sensitivity slider (e.g., 45%).',
        visualCue: 'Lower threshold = catches more subtle flaws; Higher threshold = fewer false alarms.',
      },
      {
        step: 'Step 3: Speed & Performance Test',
        detail: 'Open "Speed & Performance Test" (Concurrency). Click "Run Speed Test" to benchmark 1,000 batches across 4 threads.',
        visualCue: 'Displays throughput (e.g., 1,420 batches/sec) and multi-threaded latency.',
      },
      {
        step: 'Step 4: Manage Database & Export Data',
        detail: 'Click "Download CSV" in the top bar for reports, or "MySQL" to check database health and sync.',
        visualCue: 'Export downloads full batch dataset with sensor values and inspection logs.',
      },
    ],
    proTips: [
      'When ramping up new tooling, lower the inspection threshold to 35% for maximum scrutiny.',
      'Use the Reset Data feature to restore baseline benchmark data during team training.',
      'Check the MySQL status modal to ensure all shift records are safely written to the database.',
    ],
    systemIntegration:
      'Admin controls govern server-side concurrency pipelines, global calibration thresholds, and database pooling.',
  },
  {
    id: 5,
    title: '🤖 AI4I Predictive Maintenance & Defect Classification',
    tagline: 'How the machine learning model detects tool wear, heat, and power failures',
    targetAudience: 'All Roles',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    icon: Cpu,
    overview:
      'The platform implements an AI4I 2020 Predictive Maintenance classification engine that evaluates physical machine sensor values and detects 5 distinct machine failure typologies.',
    keyResponsibilities: [
      'Understand the 5 Failure Typologies: TWF, HDF, PWF, OSF, RNF',
      'Detect non-linear cross-parameter anomalies (e.g., Power = Torque × Rotational Speed)',
      'Review SHAP-style feature contributions for full transparency and explainability',
      'Bridge the gap between raw machine telemetry and actionable operator decisions',
    ],
    stepByStepGuide: [
      {
        step: '1. Tool Wear Failure (TWF)',
        detail: 'Occurs when continuous cutting time exceeds safe tooling life (200 - 240 mins).',
        visualCue: 'Indicates tool needs replacement before edge chipping occurs.',
      },
      {
        step: '2. Heat Dissipation Failure (HDF)',
        detail: 'Occurs when process temperature difference is under 8.6 K at rotational speeds below 1380 RPM.',
        visualCue: 'Warns that coolant lines or lubrication are inadequate.',
      },
      {
        step: '3. Power Failure (PWF)',
        detail: 'Occurs when mechanical power (Torque × Speed in rad/s) is outside 3500 W - 9000 W.',
        visualCue: 'Flags electrical surge or motor stall resistance.',
      },
      {
        step: '4. Overstrain Failure (OSF)',
        detail: 'Occurs when the product of tool wear and torque exceeds material strain limits.',
        visualCue: 'Prevents catastrophic workpiece cracking.',
      },
    ],
    proTips: [
      'Open the "Find Machine Problems" module in the top navigation to test interactive machine readings.',
      'The model computes confidence scores alongside defect probability to eliminate guesswork.',
      'Operators and officers can review the exact feature contribution bars explaining why a part was flagged.',
    ],
    systemIntegration:
      'Runs non-blocking inference in under 12ms per batch item with closed-loop parameter tuning.',
  },
  {
    id: 6,
    title: '🗄️ MySQL Database Storage & System Architecture',
    tagline: 'How data flows from shopfloor sensors to persistent database storage',
    targetAudience: 'All Roles',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    icon: Database,
    overview:
      'The full-stack platform features a dedicated Express server with MySQL connection pooling, structured schema migrations, and seamless offline-tolerant browser caching.',
    keyResponsibilities: [
      'Ensure every sensor reading, inspection result, and user decision is permanently saved',
      'Provide structured relational indexing on timestamps, production lines, and inspection statuses',
      'Enable instant cloud data push and pull across multiple shifts and factory terminals',
      'Maintain zero data loss with resilient local fallback storage',
    ],
    stepByStepGuide: [
      {
        step: 'Step 1: Connection Health Check',
        detail: 'Click the "MySQL" badge in the top bar. The app checks database reachability and table health.',
        visualCue: 'Green indicator shows "Connected & Ready" with active row counts.',
      },
      {
        step: 'Step 2: Table Creation (Auto-Create)',
        detail: 'If setting up on a new database host, click "Auto-Create `machine_batches` Table" for 1-click provisioning.',
        visualCue: 'Creates table with 25 typed columns and performance indices.',
      },
      {
        step: 'Step 3: Push & Pull Synchronization',
        detail: 'Click "Push Local Batches to MySQL" to sync current shift batches, or "Pull from MySQL" to reload saved data.',
        visualCue: 'Success toast displays exact number of records synchronized.',
      },
      {
        step: 'Step 4: Continuous Background Sync',
        detail: 'All newly logged batches and officer inspections automatically save to MySQL in the background.',
        visualCue: 'Non-blocking async HTTP calls guarantee zero UI stuttering.',
      },
    ],
    proTips: [
      'MySQL credentials can be updated dynamically via the "Edit Credentials" panel without restarting the server.',
      'The schema script is also available in `mysql-schema.sql` at the root of the project.',
      'Local storage acts as an automatic fallback if network or database connectivity is temporarily lost.',
    ],
    systemIntegration:
      'Backend uses connection pooling with keep-alive, transaction timeouts, and JSON raw payload preservation.',
  },
];

interface ProjectPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection?: (sectionId: string) => void;
}

export const ProjectPresentationModal: React.FC<ProjectPresentationModalProps> = ({
  isOpen,
  onClose,
  onSelectSection,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
      <div
        className={`relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen ? 'w-screen h-screen rounded-none' : 'max-w-5xl h-[92vh]'
        }`}
      >
        {/* Presentation Header Bar */}
        <header className="px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Factory Operations Presentation (PPT)
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  SLIDE {currentSlide.id} OF {SLIDES.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Complete Operating Guide for Workers, Quality Officers &amp; Plant Admins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick slide thumbnails */}
            <div className="hidden md:flex items-center gap-1 mr-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                  title={s.title}
                >
                  {s.id}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              title="Print / Save as PDF"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              title="Close Presentation"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Slide Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Slide Title Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${currentSlide.badgeColor}`}>
                    {currentSlide.targetAudience}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Module #{currentSlide.id}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{currentSlide.title}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {currentSlide.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Step-by-step Standard Operating Procedure
                </span>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white block mb-1">Executive Summary:</strong>
            {currentSlide.overview}
          </div>

          {/* Main Content Grid: Key Responsibilities & Step-by-Step Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Key Responsibilities */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Responsibilities &amp; Goals</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentSlide.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tips Box */}
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Pro Tips &amp; Safety Checks</span>
                </h3>
                <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-300/90">
                  {currentSlide.proTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Step-by-Step Procedure */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Interactive Workflow &amp; Step-by-Step Actions</span>
                </h3>

                <div className="space-y-3">
                  {currentSlide.stepByStepGuide.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 transition-colors"
                    >
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center justify-between">
                        <span>{item.step}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Step #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.detail}
                      </p>
                      <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>Visual Cue: {item.visualCue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Integration Note */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2 font-mono">
                <Server className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{currentSlide.systemIntegration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Presentation Navigation Footer */}
        <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Slide {currentSlideIndex + 1} of {SLIDES.length}: {currentSlide.title}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Close Presentation
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
