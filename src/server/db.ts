import 'dotenv/config';
import mysql from 'mysql2/promise';

// MySQL connection pool
let pool: mysql.Pool | null = null;

// Database configuration
let currentConfig = {
  host: process.env.MYSQL_HOST || '',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || '',
};

// Update database configuration
export function updateDbConfig(config: {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}) {
  if (pool) {
    pool.end().catch((err) => {
      console.error('[MySQL] Error closing old connection:', err);
    });
    pool = null;
  }

  currentConfig = {
    ...currentConfig,
    ...config,
  };

  return {
    ...currentConfig,
    password: undefined,
  };
}

// Get MySQL connection pool
export function getDbPool(): mysql.Pool | null {
  const host = currentConfig.host || process.env.MYSQL_HOST;
  const user = currentConfig.user || process.env.MYSQL_USER;
  const database =
    currentConfig.database || process.env.MYSQL_DATABASE;

  if (!host || !user || !database) {
    console.error('[MySQL] Missing database configuration.');
    return null;
  }

  if (!pool) {
    try {
      pool = mysql.createPool({
        host,
        port: currentConfig.port || 3306,
        user,
        password:
          currentConfig.password || process.env.MYSQL_PASSWORD || '',
        database,

        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,

        enableKeepAlive: true,
        keepAliveInitialDelay: 0,

        connectTimeout: 10000,
      });

    } catch (error) {
      console.error('[MySQL] Pool creation error:', error);
      pool = null;
    }
  }

  return pool;
}

// Create database table if it does not exist
export async function createSchemaTableIfMissing(): Promise<{
  success: boolean;
  message: string;
}> {
  const db = getDbPool();

  if (!db) {
    return {
      success: false,
      message: 'MySQL is not configured.',
    };
  }

  try {
    await db.query(`
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
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_timestamp (timestamp DESC),
        INDEX idx_status (inspection_status),
        INDEX idx_product_line (product_line)

      ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4
        COLLATE=utf8mb4_unicode_ci;
    `);

    return {
      success: true,
      message: 'machine_batches table verified successfully.',
    };

  } catch (error: any) {
    console.error('[MySQL] Schema creation error:', error);

    return {
      success: false,
      message: error.message || 'Error creating database table.',
    };
  }
}

// Check MySQL connection and database records
export async function checkMySqlConnection(): Promise<{
  connected: boolean;
  configured: boolean;
  host?: string;
  database?: string;
  tableExists: boolean;
  tableCount: number;
  error?: string;
}> {

  const host = currentConfig.host || process.env.MYSQL_HOST;
  const user = currentConfig.user || process.env.MYSQL_USER;
  const database =
    currentConfig.database || process.env.MYSQL_DATABASE;

  if (!host || !user || !database) {
    return {
      connected: false,
      configured: false,
      tableExists: false,
      tableCount: 0,
      error: 'MySQL configuration is missing.',
    };
  }

  try {
    const db = getDbPool();

    if (!db) {
      throw new Error('Failed to initialize MySQL connection pool.');
    }

    // Test connection
    const connection = await db.getConnection();

    try {
      await connection.query('SELECT 1');
    } finally {
      connection.release();
    }

    // Check whether the table exists
    const [tables]: any = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM information_schema.tables
       WHERE table_schema = ?
       AND table_name = ?`,
      [database, 'machine_batches']
    );

    const tableExists = Number(tables[0]?.cnt || 0) > 0;

    let tableCount = 0;

    // Get total records
    if (tableExists) {
      const [rows]: any = await db.query(
        'SELECT COUNT(*) AS total FROM machine_batches'
      );

      tableCount = Number(rows[0]?.total || 0);
    }

    return {
      connected: true,
      configured: true,
      host,
      database,
      tableExists,
      tableCount,
    };

  } catch (error: any) {
    console.error('[MySQL] Connection error:', error);

    return {
      connected: false,
      configured: true,
      host,
      database,
      tableExists: false,
      tableCount: 0,
      error: error.message || 'Database connection error.',
    };
  }
}

// Get all saved machine batch records
export async function getMachineBatchRecords() {
  const db = getDbPool();

  if (!db) {
    throw new Error('MySQL is not configured.');
  }

  const [rows] = await db.query(
    `SELECT * FROM machine_batches
     ORDER BY timestamp DESC`
  );

  return rows;
}

// Close MySQL connection pool
export async function closeDbConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}