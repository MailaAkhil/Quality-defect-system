import { BatchItem, User, ProcessParameters } from '../types';
import { predictDefect } from '../utils/mlEngine';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-quality-officer',
    name: 'Quality Officer',
    role: 'quality_officer',
    email: 'quality.officer@qcplatform.com',
    badgeNumber: 'QO-8842',
    shift: 'Quality Assurance Shift A',
  },
  {
    id: 'usr-admin',
    name: 'Admin',
    role: 'admin',
    email: 'admin@qcplatform.com',
    badgeNumber: 'ADM-001',
    shift: 'Full System Access',
  },
  {
    id: 'usr-employee',
    name: 'Employee',
    role: 'employee',
    email: 'employee@qcplatform.com',
    badgeNumber: 'EMP-1120',
    shift: 'Production Floor Shift B',
  },
];

const RAW_BATCH_SEEDS: Omit<ProcessParameters, 'timestamp'>[] = [
  {
    batchId: 'BATCH-2026-0841',
    productLine: 'Line A - Precision CNC',
    materialGrade: 'TI-6AL-4V',
    temperature: 254.2,
    pressure: 3.4,
    vibration: 3.82,
    machineSpeed: 1820,
    cycleTime: 33.2,
    humidity: 58.4,
    coolingRate: 39.5,
    operatorName: 'Employee',
  },
  {
    batchId: 'BATCH-2026-0840',
    productLine: 'Line B - High Pressure Die-Cast',
    materialGrade: 'AL-6061-T6',
    temperature: 211.5,
    pressure: 4.85,
    vibration: 1.15,
    machineSpeed: 1445,
    cycleTime: 42.1,
    humidity: 43.2,
    coolingRate: 27.8,
    operatorName: 'Quality Officer',
  },
  {
    batchId: 'BATCH-2026-0839',
    productLine: 'Line B - High Pressure Die-Cast',
    materialGrade: 'AL-6061-T6',
    temperature: 172.0,
    pressure: 2.35,
    vibration: 1.45,
    machineSpeed: 1680,
    cycleTime: 28.5,
    humidity: 49.0,
    coolingRate: 31.0,
    operatorName: 'Employee',
  },
  {
    batchId: 'BATCH-2026-0838',
    productLine: 'Line C - Thermal Annealing',
    materialGrade: 'SS-316L',
    temperature: 208.9,
    pressure: 4.78,
    vibration: 1.22,
    machineSpeed: 1455,
    cycleTime: 41.8,
    humidity: 44.5,
    coolingRate: 28.2,
    operatorName: 'Employee',
  },
  {
    batchId: 'BATCH-2026-0837',
    productLine: 'Line D - Laser Welding',
    materialGrade: 'CR-1045-STEEL',
    temperature: 278.4,
    pressure: 5.10,
    vibration: 4.45,
    machineSpeed: 1950,
    cycleTime: 32.0,
    humidity: 71.2,
    coolingRate: 46.8,
    operatorName: 'Quality Officer',
  },
  {
    batchId: 'BATCH-2026-0836',
    productLine: 'Line A - Precision CNC',
    materialGrade: 'TI-6AL-4V',
    temperature: 212.8,
    pressure: 4.82,
    vibration: 1.18,
    machineSpeed: 1460,
    cycleTime: 42.5,
    humidity: 42.0,
    coolingRate: 27.5,
    operatorName: 'Employee',
  },
  {
    batchId: 'BATCH-2026-0835',
    productLine: 'Line C - Thermal Annealing',
    materialGrade: 'SS-316L',
    temperature: 262.3,
    pressure: 4.12,
    vibration: 2.95,
    machineSpeed: 1710,
    cycleTime: 36.4,
    humidity: 64.0,
    coolingRate: 41.2,
    operatorName: 'Admin',
  },
  {
    batchId: 'BATCH-2026-0834',
    productLine: 'Line B - High Pressure Die-Cast',
    materialGrade: 'AL-6061-T6',
    temperature: 209.2,
    pressure: 4.90,
    vibration: 1.05,
    machineSpeed: 1430,
    cycleTime: 43.0,
    humidity: 41.5,
    coolingRate: 28.0,
    operatorName: 'Employee',
  },
  {
    batchId: 'BATCH-2026-0833',
    productLine: 'Line D - Laser Welding',
    materialGrade: 'CR-1045-STEEL',
    temperature: 182.4,
    pressure: 3.10,
    vibration: 2.45,
    machineSpeed: 1590,
    cycleTime: 38.0,
    humidity: 52.8,
    coolingRate: 34.5,
    operatorName: 'Quality Officer',
  },
  {
    batchId: 'BATCH-2026-0832',
    productLine: 'Line A - Precision CNC',
    materialGrade: 'AL-6061-T6',
    temperature: 210.1,
    pressure: 4.88,
    vibration: 1.12,
    machineSpeed: 1450,
    cycleTime: 42.0,
    humidity: 44.0,
    coolingRate: 28.1,
    operatorName: 'Employee',
  },
];

export function generateInitialBatches(): BatchItem[] {
  const now = Date.now();

  return RAW_BATCH_SEEDS.map((seed, index) => {
    const timestamp = new Date(now - index * 42 * 60 * 1000).toISOString();
    const params: ProcessParameters = {
      ...seed,
      timestamp,
    };

    const prediction = predictDefect(params);

    // Set inspection statuses for realistic dashboard history
    let inspectionStatus: BatchItem['inspection']['status'] = 'pending';
    let feedbackSubmitted = false;
    let actualDefect = prediction.predictedDefectType;
    let actualDisposition: BatchItem['inspection']['actualDisposition'] = 'Approved';
    let inspectorName = undefined;
    let visualPass = true;
    let dimPass = true;
    let ndtPass = true;
    let roughnessPass = true;

    if (prediction.flaggedForInspection) {
      if (index >= 6) {
        // Already inspected in past shift
        inspectionStatus = prediction.defectProbability > 65 ? 'failed' : 'passed';
        feedbackSubmitted = true;
        inspectorName = 'Quality Officer';
        if (inspectionStatus === 'failed') {
          actualDisposition = prediction.defectProbability > 85 ? 'Scrap' : 'Rework Required';
          visualPass = false;
          ndtPass = false;
        }
      } else {
        // Pending inspection in active queue
        inspectionStatus = 'pending';
      }
    } else {
      // Nominal batch passed automatically or routine sampling
      inspectionStatus = 'passed';
    }

    return {
      id: seed.batchId,
      parameters: params,
      prediction,
      inspection: {
        status: inspectionStatus,
        inspectorName,
        inspectionTimestamp: inspectionStatus !== 'pending' ? timestamp : undefined,
        visualCheckPassed: visualPass,
        dimensionalTolerancePassed: dimPass,
        ultrasonicNDTPassed: ndtPass,
        surfaceRoughnessPassed: roughnessPass,
        actualDefectFound: inspectionStatus === 'failed' ? actualDefect : 'None',
        actualDisposition: inspectionStatus === 'failed' ? actualDisposition : 'Approved',
        inspectorNotes:
          inspectionStatus === 'failed'
            ? 'Confirmed defect aligned with ML telemetry prediction. Quarantined for scrap review.'
            : undefined,
        feedbackSubmitted,
      },
    };
  });
}

export const PRESET_SCENARIOS: { label: string; description: string; params: Partial<ProcessParameters> }[] = [
  {
    label: 'Standard Golden Batch (Nominal)',
    description: 'All parameters within calibrated tolerance windows (AL-6061-T6)',
    params: {
      temperature: 210.5,
      pressure: 4.82,
      vibration: 1.12,
      machineSpeed: 1450,
      cycleTime: 42.0,
      humidity: 43.5,
      coolingRate: 27.8,
      materialGrade: 'AL-6061-T6',
      productLine: 'Line A - Precision CNC',
    },
  },
  {
    label: 'Thermal Spindle Shock & Severe Vibration',
    description: 'High temperature excursion combined with excessive spindle chatter',
    params: {
      temperature: 284.0,
      pressure: 4.2,
      vibration: 4.85,
      machineSpeed: 1980,
      cycleTime: 31.0,
      humidity: 62.0,
      coolingRate: 48.0,
      materialGrade: 'TI-6AL-4V',
      productLine: 'Line A - Precision CNC',
    },
  },
  {
    label: 'Hydraulic Cavitation & Gas Porosity',
    description: 'Severe pressure drop with rushed cycle speed causing porous voids in die cast',
    params: {
      temperature: 168.0,
      pressure: 2.15,
      vibration: 1.65,
      machineSpeed: 1750,
      cycleTime: 26.5,
      humidity: 48.0,
      coolingRate: 32.5,
      materialGrade: 'AL-6061-T6',
      productLine: 'Line B - High Pressure Die-Cast',
    },
  },
  {
    label: 'High Humidity Thermal Warpage',
    description: 'Moisture saturation and irregular annealing gradient causing dimensional warping',
    params: {
      temperature: 264.5,
      pressure: 4.6,
      vibration: 2.3,
      machineSpeed: 1420,
      cycleTime: 44.0,
      humidity: 82.5,
      coolingRate: 15.2,
      materialGrade: 'SS-316L',
      productLine: 'Line C - Thermal Annealing',
    },
  },
];
