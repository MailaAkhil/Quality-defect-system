import { BatchItem } from '../types';

export interface MySqlConnectionStatus {
  connected: boolean;
  configured: boolean;
  host?: string;
  database?: string;
  tableExists: boolean;
  tableCount: number;
  lastChecked: string;
  error?: string;
}

export const checkMySqlStatus = async (): Promise<MySqlConnectionStatus> => {
  try {
    const res = await fetch('/api/mysql/status');
    const data = await res.json();
    return {
      ...data,
      lastChecked: new Date().toLocaleTimeString(),
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: false,
      tableExists: false,
      tableCount: 0,
      lastChecked: new Date().toLocaleTimeString(),
      error: err?.message || 'Could not reach server endpoint',
    };
  }
};

export const fetchBatchesFromMySql = async (): Promise<BatchItem[] | null> => {
  try {
    const res = await fetch('/api/mysql/batches');
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.batches) ? data.batches : null;
  } catch (err) {
    console.warn('MySQL fetchBatches error:', err);
    return null;
  }
};

export const saveBatchToMySql = async (batch: BatchItem): Promise<boolean> => {
  try {
    const res = await fetch('/api/mysql/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    return res.ok;
  } catch (err) {
    console.warn('MySQL saveBatch error:', err);
    return false;
  }
};

export const syncAllBatchesToMySql = async (batches: BatchItem[]): Promise<{ success: boolean; count: number }> => {
  try {
    const res = await fetch('/api/mysql/batches/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batches }),
    });
    if (!res.ok) return { success: false, count: 0 };
    const data = await res.json();
    return { success: Boolean(data?.success), count: data?.count || 0 };
  } catch (err) {
    console.warn('MySQL syncAllBatches error:', err);
    return { success: false, count: 0 };
  }
};

export const updateMySqlConfig = async (config: {
  host: string;
  port?: number;
  user: string;
  password?: string;
  database: string;
}): Promise<{ success: boolean; status: MySqlConnectionStatus; error?: string }> => {
  try {
    const res = await fetch('/api/mysql/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    return {
      success: Boolean(data?.success),
      status: data?.status || {
        connected: false,
        configured: true,
        tableExists: false,
        tableCount: 0,
        lastChecked: new Date().toLocaleTimeString(),
      },
      error: data?.error,
    };
  } catch (err: any) {
    return {
      success: false,
      status: {
        connected: false,
        configured: true,
        tableExists: false,
        tableCount: 0,
        lastChecked: new Date().toLocaleTimeString(),
      },
      error: err?.message || 'Connection request failed',
    };
  }
};

export const initMySqlTable = async (): Promise<{ success: boolean; message: string; status?: MySqlConnectionStatus }> => {
  try {
    const res = await fetch('/api/mysql/init-table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return {
      success: Boolean(data?.success),
      message: data?.message || 'Table initialization finished',
      status: data?.status,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to initialize table',
    };
  }
};
