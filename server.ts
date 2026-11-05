import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getDbPool, checkMySqlConnection, updateDbConfig, createSchemaTableIfMissing } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: MySQL Connection status & stats
  app.get('/api/mysql/status', async (_req, res) => {
    try {
      const status = await checkMySqlConnection();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({
        connected: false,
        configured: false,
        tableExists: false,
        tableCount: 0,
        error: err?.message || 'Server error checking MySQL',
      });
    }
  });

  // API Route: Dynamically connect / update MySQL credentials
  app.post('/api/mysql/config', async (req, res) => {
    try {
      const { host, port, user, password, database } = req.body;
      updateDbConfig({
        host,
        port: port ? Number(port) : 3306,
        user,
        password,
        database,
      });

      // Verify connection immediately
      const status = await checkMySqlConnection();
      res.json({
        success: status.connected,
        status,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to update MySQL config',
      });
    }
  });

  // API Route: Automatically initialize machine_batches table
  app.post('/api/mysql/init-table', async (_req, res) => {
    try {
      const result = await createSchemaTableIfMissing();
      const status = await checkMySqlConnection();
      res.json({
        ...result,
        status,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err?.message || 'Failed to initialize table',
      });
    }
  });

  // API Route: Get all batches from MySQL
  app.get('/api/mysql/batches', async (_req, res) => {
    const pool = getDbPool();
    if (!pool) {
      return res.status(503).json({
        error: 'MySQL database is not configured. Set MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE in environment.',
      });
    }

    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM machine_batches ORDER BY timestamp DESC LIMIT 200`
      );

      // Map rows back to BatchItem schema
      const batches = rows.map((r: any) => {
        if (r.raw_payload) {
          try {
            const parsed = typeof r.raw_payload === 'string' ? JSON.parse(r.raw_payload) : r.raw_payload;
            if (parsed && parsed.parameters) return parsed;
          } catch {
            // fallback
          }
        }

        return {
          id: r.id,
          parameters: {
            batchId: r.batch_id,
            productLine: r.product_line,
            materialGrade: r.material_grade,
            temperature: Number(r.temperature),
            pressure: Number(r.pressure),
            vibration: Number(r.vibration),
            machineSpeed: Number(r.machine_speed),
            cycleTime: Number(r.cycle_time),
            humidity: Number(r.humidity),
            coolingRate: Number(r.cooling_rate),
            operatorName: r.operator_name || 'Operator',
            timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
          },
          prediction: {
            defectProbability: Number(r.defect_probability),
            riskLevel: r.risk_level || 'low',
            predictedDefectType: r.predicted_defect || 'None',
            flaggedForInspection: Boolean(r.flagged_for_inspection),
            confidence: Number(r.confidence || 85),
            featureContributions: [],
            latencyMs: 12,
          },
          inspection: {
            status: r.inspection_status || 'pending',
            visualCheckPassed: !r.flagged_for_inspection,
            dimensionalTolerancePassed: !r.flagged_for_inspection,
            ultrasonicNDTPassed: !r.flagged_for_inspection,
            surfaceRoughnessPassed: !r.flagged_for_inspection,
            actualDefectFound: r.actual_defect_found || 'None',
            actualDisposition: r.actual_disposition || (r.flagged_for_inspection ? 'Rework Required' : 'Approved'),
            inspectorName: r.inspector_name || undefined,
            inspectionTimestamp: r.inspection_timestamp ? new Date(r.inspection_timestamp).toISOString() : undefined,
            inspectorNotes: r.inspector_notes || undefined,
            feedbackSubmitted: Boolean(r.inspector_name),
          },
        };
      });

      res.json({ batches, count: batches.length });
    } catch (err: any) {
      console.error('[MySQL Error /api/mysql/batches]:', err);
      res.status(500).json({ error: err?.message || 'Failed to fetch batches from MySQL' });
    }
  });

  // API Route: Upsert single batch to MySQL
  app.post('/api/mysql/batches', async (req, res) => {
    const pool = getDbPool();
    if (!pool) {
      return res.status(503).json({ error: 'MySQL is not configured.' });
    }

    const b = req.body;
    if (!b || !b.id || !b.parameters) {
      return res.status(400).json({ error: 'Invalid batch payload.' });
    }

    try {
      const sql = `
        INSERT INTO machine_batches (
          id, batch_id, product_line, material_grade,
          temperature, pressure, vibration, machine_speed,
          cycle_time, humidity, cooling_rate, operator_name,
          timestamp, defect_probability, risk_level, predicted_defect,
          flagged_for_inspection, confidence, inspection_status,
          inspector_name, inspection_timestamp, actual_defect_found,
          actual_disposition, inspector_notes, raw_payload
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          product_line = VALUES(product_line),
          material_grade = VALUES(material_grade),
          temperature = VALUES(temperature),
          pressure = VALUES(pressure),
          vibration = VALUES(vibration),
          machine_speed = VALUES(machine_speed),
          cycle_time = VALUES(cycle_time),
          humidity = VALUES(humidity),
          cooling_rate = VALUES(cooling_rate),
          operator_name = VALUES(operator_name),
          defect_probability = VALUES(defect_probability),
          risk_level = VALUES(risk_level),
          predicted_defect = VALUES(predicted_defect),
          flagged_for_inspection = VALUES(flagged_for_inspection),
          confidence = VALUES(confidence),
          inspection_status = VALUES(inspection_status),
          inspector_name = VALUES(inspector_name),
          inspection_timestamp = VALUES(inspection_timestamp),
          actual_defect_found = VALUES(actual_defect_found),
          actual_disposition = VALUES(actual_disposition),
          inspector_notes = VALUES(inspector_notes),
          raw_payload = VALUES(raw_payload)
      `;

      const values = [
        b.id,
        b.parameters.batchId || b.id,
        b.parameters.productLine,
        b.parameters.materialGrade,
        b.parameters.temperature,
        b.parameters.pressure,
        b.parameters.vibration,
        b.parameters.machineSpeed,
        b.parameters.cycleTime,
        b.parameters.humidity,
        b.parameters.coolingRate,
        b.parameters.operatorName || null,
        b.parameters.timestamp ? new Date(b.parameters.timestamp) : new Date(),
        b.prediction?.defectProbability ?? 0,
        b.prediction?.riskLevel ?? 'low',
        b.prediction?.predictedDefectType ?? 'None',
        b.prediction?.flaggedForInspection ? 1 : 0,
        b.prediction?.confidence ?? 85,
        b.inspection?.status ?? 'pending',
        b.inspection?.inspectorName || null,
        b.inspection?.inspectionTimestamp ? new Date(b.inspection.inspectionTimestamp) : null,
        b.inspection?.actualDefectFound || null,
        b.inspection?.actualDisposition || null,
        b.inspection?.inspectorNotes || null,
        JSON.stringify(b),
      ];

      await pool.query(sql, values);
      res.json({ success: true, id: b.id });
    } catch (err: any) {
      console.error('[MySQL Error /api/mysql/batches POST]:', err);
      res.status(500).json({ error: err?.message || 'Failed to save batch to MySQL' });
    }
  });

  // API Route: Bulk sync batches to MySQL
  app.post('/api/mysql/batches/sync', async (req, res) => {
    const pool = getDbPool();
    if (!pool) {
      return res.status(503).json({ error: 'MySQL is not configured.' });
    }

    const { batches } = req.body;
    if (!Array.isArray(batches) || batches.length === 0) {
      return res.status(400).json({ error: 'Batches array is required.' });
    }

    try {
      let savedCount = 0;
      for (const b of batches) {
        const sql = `
          INSERT INTO machine_batches (
            id, batch_id, product_line, material_grade,
            temperature, pressure, vibration, machine_speed,
            cycle_time, humidity, cooling_rate, operator_name,
            timestamp, defect_probability, risk_level, predicted_defect,
            flagged_for_inspection, confidence, inspection_status,
            inspector_name, inspection_timestamp, actual_defect_found,
            actual_disposition, inspector_notes, raw_payload
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            product_line = VALUES(product_line),
            material_grade = VALUES(material_grade),
            temperature = VALUES(temperature),
            pressure = VALUES(pressure),
            vibration = VALUES(vibration),
            machine_speed = VALUES(machine_speed),
            cycle_time = VALUES(cycle_time),
            humidity = VALUES(humidity),
            cooling_rate = VALUES(cooling_rate),
            operator_name = VALUES(operator_name),
            defect_probability = VALUES(defect_probability),
            risk_level = VALUES(risk_level),
            predicted_defect = VALUES(predicted_defect),
            flagged_for_inspection = VALUES(flagged_for_inspection),
            confidence = VALUES(confidence),
            inspection_status = VALUES(inspection_status),
            inspector_name = VALUES(inspector_name),
            inspection_timestamp = VALUES(inspection_timestamp),
            actual_defect_found = VALUES(actual_defect_found),
            actual_disposition = VALUES(actual_disposition),
            inspector_notes = VALUES(inspector_notes),
            raw_payload = VALUES(raw_payload)
        `;

        const values = [
          b.id,
          b.parameters?.batchId || b.id,
          b.parameters?.productLine || 'Line A - Precision CNC',
          b.parameters?.materialGrade || 'AL-6061-T6',
          b.parameters?.temperature || 200,
          b.parameters?.pressure || 4.5,
          b.parameters?.vibration || 1.2,
          b.parameters?.machineSpeed || 1400,
          b.parameters?.cycleTime || 40,
          b.parameters?.humidity || 45,
          b.parameters?.coolingRate || 25,
          b.parameters?.operatorName || null,
          b.parameters?.timestamp ? new Date(b.parameters.timestamp) : new Date(),
          b.prediction?.defectProbability ?? 0,
          b.prediction?.riskLevel ?? 'low',
          b.prediction?.predictedDefectType ?? 'None',
          b.prediction?.flaggedForInspection ? 1 : 0,
          b.prediction?.confidence ?? 85,
          b.inspection?.status ?? 'pending',
          b.inspection?.inspectorName || null,
          b.inspection?.inspectionTimestamp ? new Date(b.inspection.inspectionTimestamp) : null,
          b.inspection?.actualDefectFound || null,
          b.inspection?.actualDisposition || null,
          b.inspection?.inspectorNotes || null,
          JSON.stringify(b),
        ];

        await pool.query(sql, values);
        savedCount++;
      }

      res.json({ success: true, count: savedCount });
    } catch (err: any) {
      console.error('[MySQL Error /api/mysql/batches/sync]:', err);
      res.status(500).json({ error: err?.message || 'Failed to sync batches to MySQL' });
    }
  });

  // Setup Vite middleware for full-stack dev server
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[QC Machine App] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
