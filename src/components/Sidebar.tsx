import React, { useState } from 'react';
import { ActiveSection, User } from '../types';
import {
  SlidersHorizontal,
  Cpu,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Layers,
  Settings,
  Cog,
  ShieldCheck,
  Activity,
  ShieldAlert,
  CheckSquare,
  Lock,
  Zap,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  currentUser: User;
  onLogout: () => void;
  flaggedCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  badgeColor?: string;
}

type AdminStationFilter = 'all' | 'admin' | 'officer' | 'employee';

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  onLogout,
  flaggedCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Admin Stations & Modules (Simple, User-Friendly Words)
  const adminSections: NavItem[] = [
    {
      id: 'admin_dashboard',
      label: 'Plant Overview & Health',
      icon: ShieldCheck,
      description: 'Factory quality, money saved & machine health',
    },
    {
      id: 'predicted_machines',
      label: 'Find Machine Problems',
      icon: Cpu,
      description: 'AI4I trained defect predictions & machine health',
      badge: 'AI4I Model',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold',
    },
    {
      id: 'admin_calibration',
      label: 'Machine Setup Check & AI Settings',
      icon: Settings,
      description: 'Set how strict the system should check parts',
    },
    {
      id: 'admin_concurrency',
      label: 'Speed & Performance Test',
      icon: Cpu,
      description: 'Test system speed when parts arrive at high volume',
    },
    {
      id: 'admin_audit',
      label: 'Security & History Logs',
      icon: Lock,
      description: 'Review system history & security records',
    },
  ];

  // Quality Officer Stations & Modules (Simple, User-Friendly Words)
  const officerSections: NavItem[] = [
    {
      id: 'officer_workbench',
      label: 'Quality Inspection Station',
      icon: ClipboardCheck,
      description: 'Inspect parts, test and approve batches',
    },
    {
      id: 'predicted_machines',
      label: 'Find Machine Problems',
      icon: Cpu,
      description: 'AI4I trained defect predictions & machine health',
      badge: 'AI4I Model',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold',
    },
    {
      id: 'officer_queue',
      label: 'Items Waiting for Review',
      icon: Activity,
      description: 'Parts flagged by AI waiting for inspection',
      badge: flaggedCount > 0 ? `${flaggedCount} need check` : undefined,
      badgeColor:
        'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold',
    },
    {
      id: 'officer_diagnostics',
      label: 'Defect Root Cause',
      icon: Cpu,
      description: 'See why a machine or batch was flagged',
    },
    {
      id: 'officer_analytics',
      label: 'Quality Charts & Trends',
      icon: BarChart3,
      description: 'Most common machine problems & pass rates',
    },
  ];

  // Employee / Worker Stations & Modules (Simple, User-Friendly Words)
  const employeeSections: NavItem[] = [
    {
      id: 'employee_console',
      label: 'Machine Status',
      icon: Zap,
      description: 'Live machine status and camera view',
    },
    {
      id: 'predicted_machines',
      label: 'Find Machine Problems',
      icon: Cpu,
      description: 'Find machine problems before they happen',
      badge: 'AI4I Model',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold',
    },
    {
      id: 'employee_logging',
      label: 'Enter Machine Readings',
      icon: SlidersHorizontal,
      description: "Enter today's readings (heat, pressure, vibration)",
    },
    {
      id: 'employee_checklist',
      label: 'Machine Setup Check',
      icon: CheckSquare,
      description: 'Check machine and safety guard before running',
    },
    {
      id: 'employee_safety',
      label: 'Safety Limits & Warnings',
      icon: ShieldAlert,
      description: 'Heat, pressure & emergency safety limits',
    },
  ];

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          label: '👔 System Admin',
          color:
            'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        };
      case 'quality_officer':
        return {
          label: '🔬 Quality Officer',
          color:
            'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'employee':
        return {
          label: '👷 Trained Operator (Worker)',
          color:
            'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
    }
  };

  const roleInfo = getRoleBadge();

  const renderNavGroup = (
    title: string,
    items: NavItem[],
    headerColor: string,
    stationTag?: string
  ) => (
    <div className="space-y-1 pt-1 pb-2">
      <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-semibold">
        <span className={headerColor}>{title}</span>
        {stationTag && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            {stationTag}
          </span>
        )}
      </div>

      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              onSelectSection(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full text-left p-2.5 rounded-2xl flex items-start gap-3 transition-all cursor-pointer group ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <div className="text-xs font-bold truncate">{item.label}</div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                      isActive
                        ? 'bg-white text-rose-700 border-transparent font-bold'
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div
                className={`text-[11px] truncate mt-0.5 ${
                  isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none shadow-2xl lg:shadow-xs transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onSelectSection('portal');
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center gap-3 min-w-0 cursor-pointer group"
              title="Return to Portal Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md shadow-indigo-500/20 shrink-0 bg-slate-900 relative flex items-center justify-center">
                <Cog className="w-6 h-6 text-indigo-400 animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span>Machine Quality Check</span>
                </div>
                <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                  Find Machine Problems
                </div>
              </div>
            </div>

            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        {/* Current Role Badge */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.color}`}
          >
            {roleInfo.label}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {currentUser.badgeNumber}
          </span>
        </div>
      </div>

      {/* Navigation Sections Area - STRICTLY FOR LOGGED IN ROLE ONLY (NO SHIFTING) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2">
        {/* Home Button */}
        <button
          onClick={() => {
            onSelectSection('portal');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer mb-2 ${
            activeSection === 'portal'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800'
          }`}
        >
          <div
            className={`p-2 rounded-xl shrink-0 ${
              activeSection === 'portal'
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold">Home</div>
            <div
              className={`text-[10px] truncate ${
                activeSection === 'portal' ? 'text-blue-100' : 'text-slate-400'
              }`}
            >
              Overview & Quick Access
            </div>
          </div>
        </button>

        {/* User is strictly confined to their own role's dashboard - no shifting */}
        {isAdmin ? (
          renderNavGroup(
            'Plant Management Suite',
            adminSections,
            'text-purple-600 dark:text-purple-400',
            'ADMIN'
          )
        ) : currentUser.role === 'quality_officer' ? (
          renderNavGroup(
            'Quality Officer Station',
            officerSections,
            'text-indigo-600 dark:text-indigo-400',
            'OFFICER'
          )
        ) : (
          renderNavGroup(
            'Operator Floor Station',
            employeeSections,
            'text-emerald-600 dark:text-emerald-400',
            'WORKER'
          )
        )}
      </div>

      {/* User Profile Card (Switch Station View is removed for non-admins) */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {currentUser.email}
            </div>
            <div className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {currentUser.role === 'admin'
                ? 'Full Administrative Privileges'
                : currentUser.role === 'quality_officer'
                ? 'Authorized NDT Inspector'
                : 'Trained Operator'}
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  </>
);
};
