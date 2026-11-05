import React, { useState, useMemo } from 'react';
import { BatchItem, User, UserRole, ActiveSection } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { LoginPage } from '../LoginPage';
import {
  Search,
  Activity,
  Heart,
  CalendarCheck,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Gauge,
  Sliders,
  Sparkles,
  ChevronRight,
  X,
  Sun,
  Moon,
  Layers,
  MapPin,
  TrendingUp,
  Check,
  HelpCircle,
  Clock,
  Camera,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  Cpu,
  Database,
  Presentation,
} from 'lucide-react';
import { DomainIntegrationSection } from '../common/DomainIntegrationSection';

interface ZillowPortalViewProps {
  batches: BatchItem[];
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onSelectSection: (section: ActiveSection) => void;
  onSelectBatch: (batchId: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  flaggedCount: number;
  onOpenMySqlModal?: () => void;
  onOpenPresentationModal?: () => void;
}

export const ZillowPortalView: React.FC<ZillowPortalViewProps> = ({
  batches,
  currentUser,
  onLogin,
  onLogout,
  onSelectSection,
  onSelectBatch,
  theme,
  onToggleTheme,
  flaggedCount,
  onOpenMySqlModal,
  onOpenPresentationModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeRailItem, setActiveRailItem] = useState<'search' | 'updates' | 'favorites' | 'plan' | 'inbox'>('search');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('quality_officer');
  const [activeStackIndex, setActiveStackIndex] = useState(0);

  // Filter high-risk and pending batches for recommendation cards
  const highRiskBatches = useMemo(() => {
    const list = batches.filter((b) => b.prediction.defectProbability >= 35 || b.prediction.flaggedForInspection);
    return list.length > 0 ? list : batches.slice(0, 5);
  }, [batches]);

  const currentDeckBatch = highRiskBatches[activeStackIndex % highRiskBatches.length] || batches[0];

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return batches
      .filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.parameters.productLine.toLowerCase().includes(q) ||
          b.parameters.materialGrade.toLowerCase().includes(q) ||
          b.prediction.predictedDefectType.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, batches]);

  const handleNextCard = () => {
    setActiveStackIndex((prev) => (prev + 1) % highRiskBatches.length);
  };

  // Safe checks in plain English
  const isTempHigh = currentDeckBatch.parameters.temperature > 225;
  const isPressureHigh = currentDeckBatch.parameters.pressure > 5.5;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* 1. TOP NAVIGATION BAR (Simple & Friendly Zillow Format) */}
      <header className="h-18 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        {/* Left Nav: Plain English Labels Adapted Strictly to Current Role (No Shifting) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <button
            onClick={() => onSelectSection('portal')}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onSelectSection('predicted_machines')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            <span>Find Machine Problems</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
              AI4I Model
            </span>
          </button>
          {currentUser ? (
            currentUser.role === 'employee' ? (
              <>
                <button
                  onClick={() => onSelectSection('employee_console')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Machine Status
                </button>
                <button
                  onClick={() => onSelectSection('employee_logging')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Enter Machine Readings
                </button>
                <button
                  onClick={() => onSelectSection('employee_checklist')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Machine Setup Check
                </button>
                <button
                  onClick={() => onSelectSection('employee_safety')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Safety Limits &amp; Warnings
                </button>
              </>
            ) : currentUser.role === 'quality_officer' ? (
              <>
                <button
                  onClick={() => onSelectSection('officer_workbench')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Quality Inspection Station
                </button>
                <button
                  onClick={() => onSelectSection('officer_queue')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Items Waiting for Review
                </button>
                <button
                  onClick={() => onSelectSection('officer_diagnostics')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Defect Root Cause
                </button>
                <button
                  onClick={() => onSelectSection('officer_analytics')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Quality Charts &amp; Trends
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectSection('admin_dashboard')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Plant Overview &amp; Health
                </button>
                <button
                  onClick={() => onSelectSection('admin_calibration')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Machine Setup Check &amp; AI Settings
                </button>
                <button
                  onClick={() => onSelectSection('admin_concurrency')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Speed &amp; Performance Test
                </button>
                <button
                  onClick={() => onSelectSection('admin_audit')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Security &amp; History Logs
                </button>
              </>
            )
          ) : (
            <>
              <button
                onClick={() => {
                  setAuthRole('employee');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                👷 Worker
              </button>
              <button
                onClick={() => {
                  setAuthRole('quality_officer');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                🔬 Officer
              </button>
              <button
                onClick={() => {
                  setAuthRole('admin');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                👔 Admin
              </button>
            </>
          )}
        </nav>

        {/* Center Brand Logo (Vision Sensor + Friendly Name) */}
        <div className="flex items-center gap-2.5 mx-auto xl:mx-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 bg-slate-900">
            <img
              src="/src/assets/images/vision_sensor_logo_1790964273856.jpg"
              alt="Quality Camera Sensor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-baseline">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-500 font-sans">
              Machine
            </span>
            <span className="text-xl sm:text-2xl font-normal tracking-tight text-slate-900 dark:text-white font-sans ml-1">
              Quality Check
            </span>
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              EASY
            </span>
          </div>
        </div>

        {/* Right Tools & Simple Sign In */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Project PPT Guide Button */}
          {onOpenPresentationModal && (
            <button
              onClick={onOpenPresentationModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Open Interactive Project Presentation (PPT Guide for Workers, Officers & Admins)"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Project PPT</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold">
                Guide
              </span>
            </button>
          )}

          {/* MySQL Database Button */}
          {onOpenMySqlModal && (
            <button
              onClick={onOpenMySqlModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="MySQL Database Status & Data Sync"
            >
              <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">MySQL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </button>
          )}

          {/* Quick Speed Test button */}
          <button
            onClick={() => onSelectSection('admin_concurrency')}
            className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
          >
            ⚡ Test Speed
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Switch Day/Night mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* User Sign In or User Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onSelectSection(
                    currentUser.role === 'admin'
                      ? 'admin_dashboard'
                      : currentUser.role === 'quality_officer'
                      ? 'officer_workbench'
                      : 'employee_console'
                  )
                }
                className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold truncate max-w-[120px]">{currentUser.name}</span>
                <span className="text-[10px] px-1 rounded bg-blue-200/50 dark:bg-blue-900/60">
                  {currentUser.role === 'quality_officer'
                    ? 'Inspector'
                    : currentUser.role === 'admin'
                    ? 'Manager'
                    : 'Operator'}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                title="Log out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthRole('quality_officer');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* BODY WITH LEFT MINI RAIL + MAIN PORTAL VIEW */}
      <div className="flex-1 flex min-w-0">
        {/* 2. LEFT VERTICAL MINI RAIL (Simple Everyday English) */}
        <aside className="w-18 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden sm:flex flex-col items-center py-5 space-y-6 select-none z-20">
          <button
            onClick={() => setActiveRailItem('search')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeRailItem === 'search'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl transition-colors ${
                activeRailItem === 'search'
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-5 h-5" />
            </div>
            <span>Find Part</span>
          </button>

          <button
            onClick={() => {
              setActiveRailItem('updates');
              if (currentUser) {
                onSelectSection('employee_console');
              } else {
                setAuthRole('employee');
                setIsAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeRailItem === 'updates'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Activity className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <span>Live Feed</span>
          </button>

          <button
            onClick={() => {
              setActiveRailItem('favorites');
              if (currentUser) {
                onSelectSection('officer_queue');
              } else {
                setAuthRole('quality_officer');
                setIsAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeRailItem === 'favorites'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {flaggedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {flaggedCount}
                </span>
              )}
            </div>
            <span>To Check</span>
          </button>

          <button
            onClick={() => {
              setActiveRailItem('plan');
              if (currentUser) {
                onSelectSection('admin_dashboard');
              } else {
                setAuthRole('admin');
                setIsAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeRailItem === 'plan'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span>Workstations</span>
          </button>

          <button
            onClick={() => {
              if (currentUser) {
                onSelectSection('predicted_machines');
              } else {
                setAuthRole('quality_officer');
                setIsAuthModalOpen(true);
              }
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
            title="Find Machine Problems (AI4I Model)"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-bold">Machines</span>
          </button>

          <button
            onClick={() => {
              setActiveRailItem('inbox');
              if (currentUser) {
                onSelectSection('admin_audit');
              } else {
                setAuthRole('admin');
                setIsAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeRailItem === 'inbox'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Inbox className="w-5 h-5" />
            </div>
            <span>Daily Log</span>
          </button>
        </aside>

        {/* MAIN SCROLLABLE CONTENT VIEW */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* 3. WIDE HERO BANNER (Simple Headline for Common People) */}
          <div className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Panoramic Photo */}
            <img
              src=""*/images/factory.jpg""
              alt="High-Tech Manufacturing Plant"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
            />
            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/40" />

            {/* Hero Content */}
            <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 text-center space-y-5">
              {/* Simple Friendly Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-semibold">
                <span>🏭 Factory Quality Made Easy</span>
                <span>•</span>
                <span className="text-white">Instant Safe/Unsafe Checks</span>
              </div>

              {/* Bold Large Everyday Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
                Check Factory Parts in Seconds.
              </h1>

              {/* Friendly Subtitle for common users */}
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto drop-shadow-sm font-medium">
                See which parts are completely safe to ship and which parts need a quick 1-minute check. No complex math required.
              </p>

              {/* Large Centered Search Bar */}
              <div className="max-w-2xl mx-auto relative pt-1">
                <div className="flex items-center bg-white dark:bg-slate-900 rounded-full shadow-2xl p-1.5 sm:p-2 border border-slate-200/80 dark:border-slate-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Type a lot number (e.g. BATCH-8921) or machine name..."
                    className="flex-1 px-4 sm:px-6 py-2.5 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (searchResults.length > 0) {
                        onSelectBatch(searchResults[0].id);
                        onSelectSection('officer_workbench');
                      }
                    }}
                    className="p-3 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Part</span>
                  </button>
                </div>

                {/* Quick 1-Click Filter Chips */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => onSelectSection('officer_queue')}
                    className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md cursor-pointer transition-colors"
                  >
                    ⚠️ See 2 Parts That Need Check
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSection('employee_console')}
                    className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md cursor-pointer transition-colors"
                  >
                    ➕ Enter Today&apos;s Readings
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSection('admin_dashboard')}
                    className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md cursor-pointer transition-colors"
                  >
                    📊 Total Pass Rate
                  </button>
                </div>

                {/* Live Search Auto-complete Dropdown */}
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-left">
                    <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">
                      Found {searchResults.length} Matching Parts
                    </div>
                    {searchResults.map((batch) => (
                      <button
                        key={batch.id}
                        onClick={() => {
                          onSelectBatch(batch.id);
                          onSelectSection('officer_workbench');
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{batch.id}</span>
                            <span className="text-xs text-slate-500 font-normal">({batch.parameters.productLine})</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Temperature: {batch.parameters.temperature}°C · Pressure: {batch.parameters.pressure} bar
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              batch.prediction.defectProbability >= 45
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {batch.prediction.defectProbability >= 45 ? '⚠️ Needs Check' : '✅ Looks Safe'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. "HOW IT WORKS IN 3 SIMPLE STEPS" (Makes it crystal clear for common people) */}
          <section className="border-b border-slate-100 dark:border-slate-800 py-8 px-4 sm:px-8 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Take Machine Readings
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Look at your machine dial (heat and pressure) and type in the simple numbers.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Instant Safety Check
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      The computer shows 🟢 <strong>Green</strong> if it is safe, or 🟡 <strong>Yellow</strong> if it needs a look.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Approve in 1 Click
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      The inspector visually checks the part and taps <strong>Pass</strong> to approve for shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. RECOMMENDATION SECTION (Super Friendly Plain English) */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Friendly Explanation & 1-Click Action */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Items Needing Attention</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Parts that need your quick check
                </h2>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Here are parts where the machine ran a bit hotter or faster than normal. Click below to inspect them with simple Pass/Fail buttons.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      onSelectBatch(currentDeckBatch.id);
                      onSelectSection('officer_workbench');
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md shadow-blue-600/25 flex items-center gap-2"
                  >
                    <span>Check Part {currentDeckBatch.id}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {!currentUser && (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-5 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-sm font-bold transition-all cursor-pointer"
                    >
                      Sign In (Pick Role)
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Floating Stacked Recommendation Cards */}
              <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
                {/* Floating Badge 1 (Friendly Top Pill) */}
                <div className="absolute -top-4 sm:-top-6 left-4 sm:left-12 z-30 flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Machine Ran Hot ({currentDeckBatch.parameters.temperature}°C)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Normal temperature is 210°C
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 (Orange Pin) */}
                <div className="absolute top-12 sm:top-14 left-0 sm:left-6 z-30 flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Machine Location</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {currentDeckBatch.parameters.productLine}
                    </div>
                  </div>
                </div>

                {/* Stacked Interactive Card Container */}
                <div className="relative w-full max-w-sm sm:max-w-md pt-8 pl-8">
                  {/* Background Stack Card (Offset 2) */}
                  <div className="absolute inset-0 top-14 left-14 bg-slate-200 dark:bg-slate-800 rounded-3xl opacity-40 shadow-md transform rotate-2" />
                  {/* Background Stack Card (Offset 1) */}
                  <div className="absolute inset-0 top-10 left-10 bg-slate-100 dark:bg-slate-850 rounded-3xl opacity-70 shadow-md transform -rotate-1" />

                  {/* Main Front Interactive Card */}
                  <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-20 transition-all">
                    {/* Part Image */}
                    <div className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden">
                      <img
                        src="/src/assets/images/industrial_inspection_station_1790762146481.jpg"
                        alt="Manufactured Component"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Heat: {currentDeckBatch.parameters.temperature}°C</span>
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                        Part Lot #{currentDeckBatch.id}
                      </div>
                    </div>

                    {/* Card Content & Metrics */}
                    <div className="p-5 space-y-4">
                      {/* Plain English Status Banner */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-black text-slate-900 dark:text-white">
                            {currentDeckBatch.prediction.defectProbability}% Chance of Flaw
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Material: {currentDeckBatch.parameters.materialGrade}
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            currentDeckBatch.prediction.flaggedForInspection
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {currentDeckBatch.prediction.flaggedForInspection ? 'Needs Quick Check' : 'Ready to Ship'}
                        </span>
                      </div>

                      {/* 3 Simple Dials */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
                        <div>
                          <div className="text-slate-400 text-[10px] font-bold">PRESSURE</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {currentDeckBatch.parameters.pressure} bar
                          </div>
                          <div className="text-[10px] text-slate-400">Normal: 4.8</div>
                        </div>

                        <div>
                          <div className="text-slate-400 text-[10px] font-bold">SPEED</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {currentDeckBatch.parameters.machineSpeed} RPM
                          </div>
                          <div className="text-[10px] text-slate-400">Normal: 1450</div>
                        </div>

                        <div>
                          <div className="text-slate-400 text-[10px] font-bold">CYCLE TIME</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {currentDeckBatch.parameters.cycleTime} sec
                          </div>
                          <div className="text-[10px] text-slate-400">Normal: 42s</div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBatch(currentDeckBatch.id);
                            onSelectSection('officer_workbench');
                          }}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <span>👉 Inspect This Part Now</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextCard}
                          className="px-3.5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Show next flagged part"
                        >
                          Next ({activeStackIndex + 1}/{highRiskBatches.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. THREE SIMPLE WORKSTATIONS FOR COMMON PEOPLE */}
          <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Choose Your Role
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    What would you like to do today?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  Each workstation is made simple. Click any box below to jump straight in.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Station 1: Part Inspector */}
                <div
                  onClick={() => onSelectSection('officer_workbench')}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Part Inspector
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Look at parts that were flagged, check for cracks or scratches, and click simple <strong>Pass</strong> or <strong>Fail</strong> buttons.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Start Inspecting</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Station 2: Machine Operator */}
                <div
                  onClick={() => onSelectSection('employee_console')}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Gauge className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Machine Worker
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Type in your machine&apos;s temperature and pressure dials. The computer instantly tells you if it&apos;s in the safe green zone.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Enter Dials</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Station 3: Plant Manager */}
                <div
                  onClick={() => onSelectSection('admin_dashboard')}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Plant Manager
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      See how many total factory parts were made today, how many passed inspection, and change safety sensitivity sliders.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>Open Overview</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. DOMAIN INTEGRATION (Machine Learning, Full Stack, Software Engineering, Operating Systems) */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <DomainIntegrationSection
              variant="detailed"
              onNavigateSection={(sec) => onSelectSection(sec)}
            />
          </section>

          {/* 8. CLEAN FOOTER */}
          <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900">
                <img
                  src="/src/assets/images/vision_sensor_logo_1790964273856.jpg"
                  alt="Quality Sensor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Quality Checker Platform
              </span>
            </div>
            <p>Simple and Visual Factory Quality Inspection for Everyone</p>
          </footer>
        </main>
      </div>

      {/* 8. PASSWORD-PROTECTED LOGIN MODAL (Quality Officer, Admin, Employee) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-md my-auto animate-in fade-in zoom-in-95 duration-150">
            <LoginPage
              onLogin={(user) => {
                setIsAuthModalOpen(false);
                onLogin(user);
              }}
              theme={theme}
              onToggleTheme={onToggleTheme}
              onClose={() => setIsAuthModalOpen(false)}
              initialRole={authRole}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
