import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  X,
  Server,
  Check,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  checkMySqlStatus,
  syncAllBatchesToMySql,
  fetchBatchesFromMySql,
  updateMySqlConfig,
  initMySqlTable,
  MySqlConnectionStatus,
} from '../../services/mysqlService';
import { BatchItem } from '../../types';

interface MySqlStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: BatchItem[];
  onBatchesUpdated: (batches: BatchItem[]) => void;
}

const MYSQL_SCHEMA_SNIPPET = `-- 1. Create Database & Use
CREATE DATABASE IF NOT EXISTS qc_factory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qc_factory_db;

-- 2. Create machine_batches Table
CREATE TABLE IF NOT EXISTS machine_batches (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL,
  product_line VARCHAR(100) NOT NULL,
  material_grade VARCHAR(64) NOT NULL,
  temperature DECIMAL(6, 2) NOT NULL,
  pressure DECIMAL(6, 2) NOT NULL,
  vibration DECIMAL(6, 2) NOT NULL,
  machine_speed INT NOT NULL,
  cycle_time DECIMAL(6, 2) NOT NULL,
  humidity DECIMAL(6, 2) NOT NULL,
  cooling_rate DECIMAL(6, 2) NOT NULL,
  operator_name VARCHAR(100),
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  defect_probability DECIMAL(6, 2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  predicted_defect VARCHAR(100) NOT NULL,
  flagged_for_inspection TINYINT(1) NOT NULL DEFAULT 0,
  confidence DECIMAL(6, 2) NOT NULL,
  inspection_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  inspector_name VARCHAR(100) NULL,
  inspection_timestamp DATETIME NULL,
  actual_defect_found VARCHAR(100) NULL,
  actual_disposition VARCHAR(64) NULL,
  inspector_notes TEXT NULL,
  raw_payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp DESC),
  INDEX idx_status (inspection_status),
  INDEX idx_product_line (product_line)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const MySqlStatusModal: React.FC<MySqlStatusModalProps> = ({
  isOpen,
  onClose,
  batches,
  onBatchesUpdated,
}) => {
  const [status, setStatus] = useState<MySqlConnectionStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCreatingTable, setIsCreatingTable] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Form inputs for credentials
  const [host, setHost] = useState<string>('127.0.0.1');
  const [port, setPort] = useState<string>('3306');
  const [user, setUser] = useState<string>('root');
  const [password, setPassword] = useState<string>('');
  const [database, setDatabase] = useState<string>('qc_factory_db');
  const [showConfigForm, setShowConfigForm] = useState<boolean>(false);

  const runCheck = async () => {
    setIsChecking(true);
    setSyncMessage(null);
    try {
      const res = await checkMySqlStatus();
      setStatus(res);
      if (res.host) setHost(res.host);
      if (res.database) setDatabase(res.database);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(MYSQL_SCHEMA_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setSyncMessage(null);
    try {
      const result = await updateMySqlConfig({
        host: host.trim(),
        port: port.trim() ? Number(port.trim()) : 3306,
        user: user.trim(),
        password,
        database: database.trim(),
      });
      setStatus(result.status);
      if (result.success) {
        setSyncMessage(`Successfully connected to MySQL at ${host}/${database}!`);
        setShowConfigForm(false);
      } else {
        setSyncMessage(`Connection failed: ${result.error || 'Check host, user, password, and port'}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInitTable = async () => {
    setIsCreatingTable(true);
    setSyncMessage(null);
    try {
      const result = await initMySqlTable();
      if (result.status) setStatus(result.status);
      setSyncMessage(result.message);
      runCheck();
    } finally {
      setIsCreatingTable(false);
    }
  };

  const handlePushAll = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncAllBatchesToMySql(batches);
      if (result.success) {
        setSyncMessage(`Successfully saved ${result.count} machine batches to MySQL!`);
        runCheck();
      } else {
        setSyncMessage('Failed to sync batches. Ensure table exists in MySQL.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullAll = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const remoteBatches = await fetchBatchesFromMySql();
      if (remoteBatches && remoteBatches.length > 0) {
        onBatchesUpdated(remoteBatches);
        setSyncMessage(`Successfully loaded ${remoteBatches.length} records from MySQL!`);
        runCheck();
      } else {
        setSyncMessage('No records found in MySQL table yet. Click "Push All to MySQL" to seed data.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>MySQL Database Storage</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    status?.connected && status?.tableExists
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {status?.connected && status?.tableExists ? 'Connected & Ready' : 'MySQL Engine Active'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Relational MySQL database for persistent telemetry &amp; inspection history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Connection Overview Banner */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Connection Status</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigForm(!showConfigForm)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{showConfigForm ? 'Hide Settings' : 'Edit Credentials'}</span>
                </button>
                <button
                  type="button"
                  onClick={runCheck}
                  disabled={isChecking}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-semibold hover:underline cursor-pointer disabled:opacity-50 ml-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Test Ping</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Database Host &amp; DB</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold truncate block">
                  {status?.host || host} / {status?.database || database}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Table State</span>
                <span className="font-semibold flex items-center gap-1.5">
                  {status?.connected && status?.tableExists ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      `machine_batches` Ready ({status.tableCount} rows)
                    </span>
                  ) : status?.connected ? (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Connected (Table Not Found)
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Server className="w-3.5 h-3.5" />
                      Awaiting connection
                    </span>
                  )}
                </span>
              </div>
            </div>

            {status?.error && !status.connected && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
                <strong>Status:</strong> {status.error}
              </div>
            )}
          </div>

          {/* Optional Direct MySQL Credentials Form */}
          {showConfigForm && (
            <form
              onSubmit={handleApplyConfig}
              className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 dark:text-blue-200">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Enter Your MySQL Connection Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Host (e.g. 127.0.0.1 or RDS Host)
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
                    placeholder="127.0.0.1"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Port</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
                    placeholder="3306"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Database User</label>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
                    placeholder="root"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
                    placeholder="••••••••"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Database Name</label>
                  <input
                    type="text"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200"
                    placeholder="qc_factory_db"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfigForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save &amp; Connect</span>
                </button>
              </div>
            </form>
          )}

          {/* Sync actions when connected & table exists */}
          {status?.connected && status?.tableExists ? (
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>MySQL Data Synchronization Active</span>
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Live machine inspections, defects, and telemetry are saving to your MySQL database.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handlePushAll}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Push Local Batches to MySQL</span>
                </button>
                <button
                  type="button"
                  onClick={handlePullAll}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Pull from MySQL</span>
                </button>
              </div>
            </div>
          ) : status?.connected && !status.tableExists ? (
            /* Connected but table missing */
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                    Connected to MySQL! Create the `machine_batches` table.
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    We can automatically run the `CREATE TABLE` query for you, or you can paste the SQL script manually.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleInitTable}
                  disabled={isCreatingTable}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Create `machine_batches` Table</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy SQL</span>
                </button>
              </div>
            </div>
          ) : (
            /* Schema and connection guide */
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-start gap-2.5">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-950 dark:text-blue-200 text-xs">
                    MySQL Connection Details
                  </h4>
                  <p className="text-xs text-blue-900/90 dark:text-blue-300/90">
                    If you created a MySQL connection (such as local MySQL, AWS RDS, PlanetScale, or Cloud SQL), click
                    <strong> "Edit Credentials"</strong> above to enter your connection host and user, or set them in
                    your server environment.
                  </p>
                </div>
              </div>

              {/* SQL box */}
              <div className="relative">
                <pre className="p-3 bg-slate-900 text-blue-300 rounded-lg text-xs font-mono overflow-x-auto max-h-36 border border-slate-800">
                  {MYSQL_SCHEMA_SNIPPET}
                </pre>
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-700 cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sync notification message */}
          {syncMessage && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Active records in memory/storage: <span className="font-bold text-slate-800 dark:text-slate-200">{batches.length}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
