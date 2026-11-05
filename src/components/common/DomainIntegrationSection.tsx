import React from 'react';
import { Cpu, LayoutDashboard, Code2, Server, CheckCircle2 } from 'lucide-react';

interface DomainIntegrationSectionProps {
  variant?: 'banner' | 'card' | 'detailed';
  onNavigateSection?: (sectionId: string) => void;
}

export const DomainIntegrationSection: React.FC<DomainIntegrationSectionProps> = ({
  variant = 'detailed',
  onNavigateSection,
}) => {
  const domains = [
    {
      id: 'ml',
      title: 'Machine Learning',
      subtitle: 'Classification model for defect prediction',
      icon: Cpu,
      color: 'indigo',
      badge: 'Defect Prediction AI',
      targetSection: 'predicted_machines',
      actionText: 'View ML Models',
      points: [
        'AI4I 2020 predictive maintenance classifier',
        '8 real-time sensor parameters (temp, pressure, vibration, speed)',
        'Calibrated risk scoring (0 - 100%) & 5 failure typologies',
        'Continuous human-in-the-loop active learning feedback',
      ],
    },
    {
      id: 'fullstack',
      title: 'Full Stack',
      subtitle: 'Quality-control-team-facing dashboard',
      icon: LayoutDashboard,
      color: 'blue',
      badge: 'Team-Facing UX',
      targetSection: 'portal',
      actionText: 'Explore Dashboards',
      points: [
        'Three role-tailored consoles: Worker, Quality Officer, and Admin',
        'Zillow-inspired clean visual card layout with real-time health stats',
        'Instant pass/fail inspection workflows & disposition logging',
        'Responsive White/Dark mode with high-contrast status cues',
      ],
    },
    {
      id: 'swe',
      title: 'Software Engineering',
      subtitle: 'Modular services, documented APIs',
      icon: Code2,
      color: 'emerald',
      badge: 'Production Architecture',
      targetSection: 'admin_audit',
      actionText: 'View System Audit',
      points: [
        'Strict TypeScript schemas across frontend, backend & database',
        'Decoupled REST API architecture with MySQL connection pooling',
        'Documented endpoints (/api/mysql/batches, /api/mysql/status)',
        'Graceful fallbacks with offline-safe local cache resilience',
      ],
    },
    {
      id: 'os',
      title: 'Operating Systems',
      subtitle: 'Concurrent batch data processing',
      icon: Server,
      color: 'amber',
      badge: 'Concurrent Pipeline',
      targetSection: 'admin_concurrency',
      actionText: 'Run Speed Benchmark',
      points: [
        'Multi-worker thread batch ingestion simulator (1,000+ batches/sec)',
        'Asynchronous sensor telemetry streaming pipeline',
        'Non-blocking event loop execution & thread scheduling simulation',
        'Live throughput latency benchmarks with memory safety',
      ],
    },
  ];

  if (variant === 'banner') {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Domain Integration
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold">
              Production Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {domains.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.id}
                onClick={() => onNavigateSection && onNavigateSection(d.targetSection)}
                className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {d.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {d.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Architecture &amp; Engineering Specs</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Domain Integration</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full-spectrum engineering integration across all 4 core pillars
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map((d) => {
          const Icon = d.icon;
          return (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                    {d.badge}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {d.title}
                </h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {d.subtitle}
                </p>

                <ul className="mt-3.5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                  {d.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {onNavigateSection && (
                <button
                  type="button"
                  onClick={() => onNavigateSection(d.targetSection)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/60 dark:hover:border-indigo-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>{d.actionText}</span>
                  <span className="text-indigo-500">→</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
