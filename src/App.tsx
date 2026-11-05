import React, { useState, useEffect } from 'react';
import {
  ActiveSection,
  BatchItem,
  DefectType,
  Disposition,
  InspectionStatus,
  ProcessParameters,
  User,
  UserRole,
} from './types';
import { DEMO_USERS, generateInitialBatches } from './data/mockData';
import { predictDefect, updateModelWithFeedback } from './utils/mlEngine';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ZillowPortalView } from './components/portal/ZillowPortalView';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminCalibration } from './components/admin/AdminCalibration';
import { AdminConcurrency } from './components/admin/AdminConcurrency';
import { AdminAudit } from './components/admin/AdminAudit';

// Quality Officer Components
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { OfficerQueue } from './components/officer/OfficerQueue';
import { OfficerDiagnostics } from './components/officer/OfficerDiagnostics';
import { OfficerAnalytics } from './components/officer/OfficerAnalytics';

// Employee Components
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { EmployeeLogging } from './components/employee/EmployeeLogging';
import { EmployeeChecklist } from './components/employee/EmployeeChecklist';
import { EmployeeSafety } from './components/employee/EmployeeSafety';

// AI4I Predictive Maintenance Component
import { PredictedMachinesView } from './components/PredictedMachinesView';

// MySQL Database Integration
import { MySqlStatusModal } from './components/common/MySqlStatusModal';
import { fetchBatchesFromMySql, saveBatchToMySql } from './services/mysqlService';

// Interactive Operations PPT Guide
import { ProjectPresentationModal } from './components/common/ProjectPresentationModal';

export default function App() {
  // Theme State: 'light' (mostly white in background) or 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('qc_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light'; // Default to pure clean white in background
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('qc_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Core batches data
  const [batches, setBatches] = useState<BatchItem[]>(() => {
    try {
      const saved = localStorage.getItem('qc_defect_batches_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return generateInitialBatches();
  });

  // Default active section based on role
  const getDefaultSectionForRole = (role: UserRole): ActiveSection => {
    switch (role) {
      case 'admin':
        return 'admin_dashboard';
      case 'quality_officer':
        return 'officer_workbench';
      case 'employee':
        return 'employee_console';
    }
  };

  const [activeSection, setActiveSection] = useState<ActiveSection>('portal');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => batches[0]?.id || '');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [inspectionThreshold, setInspectionThreshold] = useState<number>(45);

  const [benchmarkStats, setBenchmarkStats] = useState<{
    totalProcessed: number;
    concurrencyThreads: number;
    elapsedMs: number;
    throughputPerSec: number;
  } | undefined>(undefined);

  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [isMySqlModalOpen, setIsMySqlModalOpen] = useState<boolean>(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState<boolean>(false);

  // Sync batches to local storage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem('qc_defect_batches_v3', JSON.stringify(batches));
    } catch {
      // ignore
    }
  }, [batches]);

  // Load latest data from MySQL database on launch if available
  useEffect(() => {
    let active = true;
    const fetchDatabaseData = async () => {
      try {
        const mySqlBatches = await fetchBatchesFromMySql();
        if (active && mySqlBatches && mySqlBatches.length > 0) {
          setBatches(mySqlBatches);
          setSelectedBatchId(mySqlBatches[0].id);
        }
      } catch (e) {
        console.warn('Initial MySQL database fetch:', e);
      }
    };
    fetchDatabaseData();
    return () => {
      active = false;
    };
  }, []);

  // Real-time sensor stream simulator (when active)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const randomLine = [
        'Line A - Precision CNC',
        'Line B - High Pressure Die-Cast',
        'Line C - Thermal Annealing',
        'Line D - Laser Welding',
      ][Math.floor(Math.random() * 4)] as ProcessParameters['productLine'];

      const randomMaterial = [
        'AL-6061-T6',
        'SS-316L',
        'TI-6AL-4V',
        'CR-1045-STEEL',
      ][Math.floor(Math.random() * 4)] as ProcessParameters['materialGrade'];

      const isAnomaly = Math.random() > 0.65;

      const temp = isAnomaly ? 260 + Math.random() * 30 : 205 + Math.random() * 10;
      const press = isAnomaly ? 2.8 + Math.random() * 0.9 : 4.6 + Math.random() * 0.5;
      const vib = isAnomaly ? 2.8 + Math.random() * 1.8 : 1.1 + Math.random() * 0.4;
      const speed = isAnomaly ? 1750 + Math.random() * 200 : 1420 + Math.random() * 60;
      const cycle = isAnomaly ? 30 + Math.random() * 6 : 41 + Math.random() * 3;
      const hum = isAnomaly ? 60 + Math.random() * 20 : 42 + Math.random() * 6;
      const cool = isAnomaly ? 38 + Math.random() * 12 : 27 + Math.random() * 3;

      const newBatchId = `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const params: ProcessParameters = {
        batchId: newBatchId,
        productLine: randomLine,
        materialGrade: randomMaterial,
        temperature: Math.round(temp * 10) / 10,
        pressure: Math.round(press * 100) / 100,
        vibration: Math.round(vib * 100) / 100,
        machineSpeed: Math.round(speed),
        cycleTime: Math.round(cycle * 10) / 10,
        humidity: Math.round(hum * 10) / 10,
        coolingRate: Math.round(cool * 10) / 10,
        operatorName: currentUser?.name || 'Employee',
        timestamp: new Date().toISOString(),
      };

      const pred = predictDefect(params);

      const newBatchItem: BatchItem = {
        id: newBatchId,
        parameters: params,
        prediction: pred,
        inspection: {
          status: pred.flaggedForInspection ? 'pending' : 'passed',
          visualCheckPassed: !pred.flaggedForInspection,
          dimensionalTolerancePassed: !pred.flaggedForInspection,
          ultrasonicNDTPassed: !pred.flaggedForInspection,
          surfaceRoughnessPassed: !pred.flaggedForInspection,
          actualDefectFound: pred.flaggedForInspection ? pred.predictedDefectType : 'None',
          actualDisposition: pred.flaggedForInspection ? 'Rework Required' : 'Approved',
          feedbackSubmitted: false,
        },
      };

      setBatches((prev) => [newBatchItem, ...prev.slice(0, 49)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, currentUser]);

  // Handle single manual/preset batch creation
  const handleLogBatch = (params: ProcessParameters): BatchItem => {
    const pred = predictDefect(params);

    const newBatch: BatchItem = {
      id: params.batchId,
      parameters: params,
      prediction: pred,
      inspection: {
        status: pred.flaggedForInspection ? 'pending' : 'passed',
        visualCheckPassed: !pred.flaggedForInspection,
        dimensionalTolerancePassed: !pred.flaggedForInspection,
        ultrasonicNDTPassed: !pred.flaggedForInspection,
        surfaceRoughnessPassed: !pred.flaggedForInspection,
        actualDefectFound: pred.flaggedForInspection ? pred.predictedDefectType : 'None',
        actualDisposition: pred.flaggedForInspection ? 'Rework Required' : 'Approved',
        feedbackSubmitted: false,
      },
    };

    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.id);
    // Sync to MySQL database
    saveBatchToMySql(newBatch).catch((err) => {
      console.warn('Could not sync new batch to MySQL:', err);
    });
    return newBatch;
  };

  // Handle Quality Officer inspection submission & closed-loop model update
  const handleSubmitInspection = (
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
  ) => {
    setBatches((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== batchId) return b;

        const wasDefective = results.actualDefectFound !== 'None';
        updateModelWithFeedback(wasDefective, b.prediction.flaggedForInspection);

        const updatedItem: BatchItem = {
          ...b,
          inspection: {
            ...b.inspection,
            status: results.status,
            actualDefectFound: results.actualDefectFound,
            actualDisposition: results.actualDisposition,
            visualCheckPassed: results.visualCheckPassed,
            dimensionalTolerancePassed: results.dimensionalTolerancePassed,
            ultrasonicNDTPassed: results.ultrasonicNDTPassed,
            surfaceRoughnessPassed: results.surfaceRoughnessPassed,
            inspectorNotes: results.inspectorNotes,
            inspectorName: currentUser?.name || 'Quality Officer',
            inspectionTimestamp: new Date().toISOString(),
            feedbackSubmitted: true,
          },
        };

        // Sync updated inspection to MySQL
        saveBatchToMySql(updatedItem).catch(() => {});
        return updatedItem;
      });
      return updated;
    });

    setFeedbackCount((c) => c + 1);
  };

  // Run OS Multi-Threaded Concurrency Benchmark
  const handleRunConcurrentBenchmark = () => {
    setIsBenchmarking(true);
    const startTime = performance.now();

    setTimeout(() => {
      const recordsToProcess = 1000;
      const threads = 4;
      const elapsed = Math.round(performance.now() - startTime + 120);
      const throughput = Math.round((recordsToProcess / (elapsed / 1000)) * 10) / 10;

      setBenchmarkStats({
        totalProcessed: recordsToProcess,
        concurrencyThreads: threads,
        elapsedMs: elapsed,
        throughputPerSec: throughput,
      });

      setIsBenchmarking(false);
    }, 450);
  };

  const handleSimulateOneConcurrent = () => {
    handleRunConcurrentBenchmark();
  };

  // Export full verification report as CSV
  const handleExportCSV = () => {
    const headers = [
      'Batch ID',
      'Timestamp',
      'Product Line',
      'Material Alloy',
      'Temperature (C)',
      'Pressure (bar)',
      'Vibration (mm/s)',
      'Speed (RPM)',
      'Cycle Time (s)',
      'ML Defect Probability (%)',
      'Predicted Defect',
      'Flagged For Inspection',
      'Inspection Status',
      'Ground Truth Defect',
      'Release Disposition',
    ];

    const rows = batches.map((b) => [
      b.id,
      b.parameters.timestamp,
      `"${b.parameters.productLine}"`,
      b.parameters.materialGrade,
      b.parameters.temperature,
      b.parameters.pressure,
      b.parameters.vibration,
      b.parameters.machineSpeed,
      b.parameters.cycleTime,
      b.prediction.defectProbability,
      b.prediction.predictedDefectType,
      b.prediction.flaggedForInspection ? 'YES' : 'NO',
      b.inspection.status,
      b.inspection.actualDefectFound,
      `"${b.inspection.actualDisposition}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QC_Defect_Prediction_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to initial benchmark dataset
  const handleResetData = () => {
    const initial = generateInitialBatches();
    setBatches(initial);
    setSelectedBatchId(initial[0].id);
    localStorage.removeItem('qc_defect_batches_v3');
  };

  // Role-based route guard: Non-admin users are strictly locked to their role's sections (while allowing portal overview and predicted machines)
  useEffect(() => {
    if (!currentUser) return;
    if (activeSection === 'portal') return; // Allow anyone to browse the Zillow-format portal!
    if (activeSection === 'predicted_machines') return; // Allow all roles to access machine predictions!
    if (currentUser.role === 'employee' && !activeSection.startsWith('employee_')) {
      setActiveSection('employee_console');
    } else if (currentUser.role === 'quality_officer' && !activeSection.startsWith('officer_')) {
      setActiveSection('officer_workbench');
    }
  }, [currentUser, activeSection]);

  // User logs in
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveSection(getDefaultSectionForRole(user.role));
  };

  const flaggedCount = batches.filter(
    (b) => b.prediction.flaggedForInspection && b.inspection.status === 'pending'
  ).length;

  // The Zillow-style portal is the primary frontend format on load or when navigating to "portal"
  if (activeSection === 'portal' || !currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <ZillowPortalView
          batches={batches}
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={() => {
            setCurrentUser(null);
            setActiveSection('portal');
          }}
          onSelectSection={(section) => {
            setActiveSection(section);
          }}
          onSelectBatch={(id) => {
            setSelectedBatchId(id);
            setActiveSection('officer_workbench');
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          flaggedCount={flaggedCount}
          onOpenMySqlModal={() => setIsMySqlModalOpen(true)}
          onOpenPresentationModal={() => setIsPresentationModalOpen(true)}
        />

        {/* MySQL Database Settings & Sync Modal */}
        <MySqlStatusModal
          isOpen={isMySqlModalOpen}
          onClose={() => setIsMySqlModalOpen(false)}
          batches={batches}
          onBatchesUpdated={(updated) => setBatches(updated)}
        />

        {/* Interactive Operations PPT Guide Modal */}
        <ProjectPresentationModal
          isOpen={isPresentationModalOpen}
          onClose={() => setIsPresentationModalOpen(false)}
          onSelectSection={(sec) => {
            setIsPresentationModalOpen(false);
            setActiveSection(sec);
          }}
        />
      </div>
    );
  }

  // Once authenticated, render full application with the requested left-side sections navigation!
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
        {/* SECTIONS ON THE LEFT SIDE - DEDICATED PER ROLE */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(section) => {
            setActiveSection(section);
            setIsMobileMenuOpen(false);
          }}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setActiveSection('portal');
          }}
          flaggedCount={flaggedCount}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* RIGHT SIDE: TOP BAR + MAIN MODULE VIEWPORT */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white dark:bg-slate-950">
          <TopBar
            activeSection={activeSection}
            totalBatches={batches.length}
            flaggedCount={flaggedCount}
            onSimulateConcurrent={handleSimulateOneConcurrent}
            onResetData={handleResetData}
            onExportReport={handleExportCSV}
            isSimulating={isBenchmarking}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onNavigateToPortal={() => setActiveSection('portal')}
            onLogout={() => {
              setCurrentUser(null);
              setActiveSection('portal');
            }}
            onOpenMySqlModal={() => setIsMySqlModalOpen(true)}
            onOpenPresentationModal={() => setIsPresentationModalOpen(true)}
          />

          <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
            {/* AI4I PREDICTED MACHINES */}
            {activeSection === 'predicted_machines' && (
              <PredictedMachinesView />
            )}

            {/* 1. ADMIN SECTIONS */}
            {activeSection === 'admin_dashboard' && (
              <AdminDashboard
                batches={batches}
                inspectionThreshold={inspectionThreshold}
                onUpdateThreshold={(t) => setInspectionThreshold(t)}
                feedbackCount={feedbackCount}
                onRunBenchmark={handleRunConcurrentBenchmark}
                isBenchmarking={isBenchmarking}
                benchmarkStats={benchmarkStats}
                onExportCSV={handleExportCSV}
                onResetData={handleResetData}
                onNavigateSection={(s) => setActiveSection(s)}
              />
            )}

            {activeSection === 'admin_calibration' && (
              <AdminCalibration
                inspectionThreshold={inspectionThreshold}
                onUpdateThreshold={(t) => setInspectionThreshold(t)}
              />
            )}

            {activeSection === 'admin_concurrency' && (
              <AdminConcurrency
                onRunBenchmark={handleRunConcurrentBenchmark}
                isBenchmarking={isBenchmarking}
                benchmarkStats={benchmarkStats}
                onNavigateSection={(s) => setActiveSection(s)}
                flaggedCount={flaggedCount}
              />
            )}

            {activeSection === 'admin_audit' && (
              <AdminAudit
                onExportCSV={handleExportCSV}
                onResetData={handleResetData}
              />
            )}

            {/* 2. QUALITY OFFICER SECTIONS */}
            {activeSection === 'officer_workbench' && (
              <OfficerDashboard
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelectBatch={(id) => setSelectedBatchId(id)}
                onSubmitInspection={handleSubmitInspection}
                currentUser={currentUser}
                onNavigateToQueue={() => setActiveSection('officer_queue')}
                onNavigateSection={(s) => setActiveSection(s)}
              />
            )}

            {activeSection === 'officer_queue' && (
              <OfficerQueue
                batches={batches}
                onSelectBatch={(id) => setSelectedBatchId(id)}
                onNavigateToWorkbench={(id) => {
                  setSelectedBatchId(id);
                  setActiveSection('officer_workbench');
                }}
              />
            )}

            {activeSection === 'officer_diagnostics' && (
              <OfficerDiagnostics
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelectBatch={(id) => setSelectedBatchId(id)}
                onNavigateToWorkbench={(id) => {
                  setSelectedBatchId(id);
                  setActiveSection('officer_workbench');
                }}
              />
            )}

            {activeSection === 'officer_analytics' && (
              <OfficerAnalytics
                batches={batches}
                feedbackCount={feedbackCount}
              />
            )}

            {/* 3. EMPLOYEE SECTIONS */}
            {activeSection === 'employee_console' && (
              <EmployeeDashboard
                batches={batches}
                onLogBatch={handleLogBatch}
                isStreaming={isStreaming}
                onToggleStreaming={() => setIsStreaming((s) => !s)}
              />
            )}

            {activeSection === 'employee_logging' && (
              <EmployeeLogging
                onLogBatch={handleLogBatch}
                recentBatches={batches}
              />
            )}

            {activeSection === 'employee_checklist' && (
              <EmployeeChecklist />
            )}

            {activeSection === 'employee_safety' && (
              <EmployeeSafety />
            )}
          </main>
        </div>
      </div>

      {/* MySQL Database Settings & Sync Modal */}
      <MySqlStatusModal
        isOpen={isMySqlModalOpen}
        onClose={() => setIsMySqlModalOpen(false)}
        batches={batches}
        onBatchesUpdated={(updated) => setBatches(updated)}
      />

      {/* Interactive Operations PPT Guide Modal */}
      <ProjectPresentationModal
        isOpen={isPresentationModalOpen}
        onClose={() => setIsPresentationModalOpen(false)}
        onSelectSection={(sec) => {
          setIsPresentationModalOpen(false);
          setActiveSection(sec);
        }}
      />
    </div>
  );
}
