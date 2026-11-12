// Core TypeScript types for the Counterfeit Medicine Detector

export type ScreeningStatus = 'low_risk' | 'elevated_risk' | 'inconclusive';
export type VisualClassification = 'genuine' | 'counterfeit';

export interface VisualAnalysisResult {
  genuineScore: number;      // 0-100
  counterfeitScore: number;  // 0-100
  classification: VisualClassification;
  confidence: number;        // 0-100
  modelName: string;
  embeddingDimensions: number;
}

export interface OcrField {
  value: string | null;
  confidence: number; // 0-100, or -1 if not detected
  detected: boolean;
}

export interface OcrAnalysisResult {
  productName: OcrField;
  batchNumber: OcrField;
  manufacturingDate: OcrField;
  expiryDate: OcrField;
  overallConfidence: number;
  medicineKeywords: string[];
  rawText: string;
}

export interface EvidenceItem {
  type: 'visual' | 'ocr' | 'warning' | 'missing';
  label: string;
  value: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  imageName: string;
  imageSize: number;
  screeningStatus: ScreeningStatus;
  visualAnalysis: VisualAnalysisResult;
  ocrAnalysis: OcrAnalysisResult;
  evidence: {
    visual: EvidenceItem[];
    ocr: EvidenceItem[];
    missing: EvidenceItem[];
    warnings: EvidenceItem[];
  };
  recommendedAction: string;
  processingTimeMs: number;
  demoMode: boolean;
}

export interface HistoryRecord {
  id: string;
  imageName: string;
  imageUrl: string;
  timestamp: string;
  screeningStatus: ScreeningStatus;
  visualClassification: VisualClassification;
  confidence: number;
  demoMode: boolean;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  balancedAccuracy: number;
  rocAuc: number;
  confusionMatrix: {
    truePositive: number;   // Actual Genuine, Predicted Genuine
    falsePositive: number;  // Actual Genuine, Predicted Counterfeit
    falseNegative: number;  // Actual Counterfeit, Predicted Genuine
    trueNegative: number;   // Actual Counterfeit, Predicted Counterfeit
  };
  datasetInfo: {
    total: number;
    training: number;
    validation: number;
    testing: number;
    syntheticForgeries: number;
  };
}

export interface DashboardStats {
  totalAnalyses: number;
  genuineClassifications: number;
  counterfeitClassifications: number;
  inconclusiveResults: number;
  recentAnalyses: HistoryRecord[];
}

export interface ProcessingStage {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  durationMs?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
