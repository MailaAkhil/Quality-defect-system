export type UserRole = 'quality_officer' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  badgeNumber: string;
  avatar?: string;
  shift: string;
}

export type MaterialGrade = 'AL-6061-T6' | 'SS-316L' | 'TI-6AL-4V' | 'CR-1045-STEEL';
export type ProductionLine = 'Line A - Precision CNC' | 'Line B - High Pressure Die-Cast' | 'Line C - Thermal Annealing' | 'Line D - Laser Welding';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type DefectType = 'None' | 'Micro-Cracking' | 'Porosity Void' | 'Dimensional Warpage' | 'Surface Roughness' | 'Incomplete Fusion';
export type InspectionStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'quarantined';
export type Disposition = 'Approved' | 'Rework Required' | 'Scrap' | 'Engineering Review';

export interface FeatureImpact {
  feature: string;
  value: number | string;
  impactScore: number; // positive = increased risk, negative = safe
  direction: 'increases_risk' | 'decreases_risk';
  description: string;
}

export interface ProcessParameters {
  batchId: string;
  productLine: ProductionLine;
  materialGrade: MaterialGrade;
  temperature: number; // °C (nominal ~210°C, 150 - 320)
  pressure: number; // bar (nominal ~4.8 bar, 2.0 - 9.0)
  vibration: number; // mm/s (nominal ~1.2 mm/s, 0.4 - 5.5)
  machineSpeed: number; // RPM (nominal ~1450, 800 - 2200)
  cycleTime: number; // seconds (nominal ~42s, 20 - 90)
  humidity: number; // % (nominal ~45%, 20 - 85)
  coolingRate: number; // °C/min (nominal ~28°C/min, 10 - 60)
  operatorName: string;
  timestamp: string;
}

export interface PredictionResult {
  defectProbability: number; // 0 - 100%
  riskLevel: RiskLevel;
  predictedDefectType: DefectType;
  flaggedForInspection: boolean;
  confidence: number; // %
  featureContributions: FeatureImpact[];
  latencyMs: number;
}

export interface InspectionRecord {
  status: InspectionStatus;
  inspectorName?: string;
  inspectionTimestamp?: string;
  visualCheckPassed: boolean;
  dimensionalTolerancePassed: boolean;
  ultrasonicNDTPassed: boolean;
  surfaceRoughnessPassed: boolean;
  actualDefectFound: DefectType;
  actualDisposition: Disposition;
  inspectorNotes?: string;
  feedbackSubmitted: boolean;
}

export interface BatchItem {
  id: string;
  parameters: ProcessParameters;
  prediction: PredictionResult;
  inspection: InspectionRecord;
}

export type ActiveSection = string;

export interface ModelMetrics {
  totalProcessed: number;
  flaggedCount: number;
  actualDefectsConfirmed: number;
  falsePositiveCount: number;
  modelAccuracy: number;
  f1Score: number;
  feedbackIterations: number;
}
