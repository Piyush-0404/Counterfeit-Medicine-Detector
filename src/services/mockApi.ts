/**
 * Mock API service — simulates backend responses.
 * Replace individual functions with real API calls when the FastAPI backend is connected.
 * Keep the response structures identical to what the real API will return.
 */

import type {
  AnalysisResult,
  DashboardStats,
  HistoryRecord,
  ModelMetrics,
  ProcessingStage,
  ScreeningStatus,
  VisualClassification,
} from '../types';
import { generateId, sleep } from '../utils';

// ─── Mock history data ───────────────────────────────────────────────────────

const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'CMD-LX7A2-B4KQ',
    imageName: 'paracetamol_500mg_front.jpg',
    imageUrl: '',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'low_risk',
    visualClassification: 'genuine',
    confidence: 91.4,
    demoMode: true,
  },
  {
    id: 'CMD-MN9C3-P7RS',
    imageName: 'amoxicillin_250mg_blister.png',
    imageUrl: '',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'elevated_risk',
    visualClassification: 'counterfeit',
    confidence: 86.7,
    demoMode: true,
  },
  {
    id: 'CMD-QT4D1-N2FJ',
    imageName: 'cetirizine_10mg_strip.jpg',
    imageUrl: '',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'low_risk',
    visualClassification: 'genuine',
    confidence: 94.2,
    demoMode: true,
  },
  {
    id: 'CMD-WR6E5-K8TM',
    imageName: 'metformin_500mg_tablet.webp',
    imageUrl: '',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'inconclusive',
    visualClassification: 'genuine',
    confidence: 61.3,
    demoMode: true,
  },
  {
    id: 'CMD-YB8F7-H5NW',
    imageName: 'atorvastatin_10mg_pack.jpg',
    imageUrl: '',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'elevated_risk',
    visualClassification: 'counterfeit',
    confidence: 89.1,
    demoMode: true,
  },
  {
    id: 'CMD-ZK2G9-M3VX',
    imageName: 'azithromycin_500mg_box.png',
    imageUrl: '',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'low_risk',
    visualClassification: 'genuine',
    confidence: 97.8,
    demoMode: true,
  },
  {
    id: 'CMD-DL5H1-Q9CY',
    imageName: 'ibuprofen_400mg_strip.jpg',
    imageUrl: '',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'low_risk',
    visualClassification: 'genuine',
    confidence: 93.5,
    demoMode: true,
  },
  {
    id: 'CMD-EO7I3-R1DZ',
    imageName: 'pantoprazole_40mg_pack.webp',
    imageUrl: '',
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    screeningStatus: 'elevated_risk',
    visualClassification: 'counterfeit',
    confidence: 82.4,
    demoMode: true,
  },
];

// ─── Processing stages ───────────────────────────────────────────────────────

export function getProcessingStages(): ProcessingStage[] {
  return [
    {
      id: 'preprocess',
      label: 'Image Preprocessing',
      description: 'Resizing, normalizing pixel values, applying augmentation pipeline',
      status: 'pending',
    },
    {
      id: 'resnet',
      label: 'ResNet-18 Feature Extraction',
      description: 'Extracting deep visual features via pretrained ResNet-18 backbone',
      status: 'pending',
    },
    {
      id: 'embedding',
      label: '128-Dimensional Embedding',
      description: 'Projecting features into triplet-learned embedding space',
      status: 'pending',
    },
    {
      id: 'svm',
      label: 'RBF-SVM Classification',
      description: 'Classifying embedding using trained Support Vector Machine',
      status: 'pending',
    },
    {
      id: 'ocr',
      label: 'OCR Text Extraction',
      description: 'Running EasyOCR to extract packaging text evidence',
      status: 'pending',
    },
    {
      id: 'report',
      label: 'Screening Report Generation',
      description: 'Compiling visual and OCR evidence into final screening result',
      status: 'pending',
    },
  ];
}

// ─── Mock analysis result generator ─────────────────────────────────────────

function buildMockResult(
  imageUrl: string,
  imageName: string,
  imageSize: number,
  classification: VisualClassification,
  screeningStatus: ScreeningStatus,
): AnalysisResult {
  const isGenuine = classification === 'genuine';
  const genuineScore = isGenuine
    ? 72 + Math.random() * 25
    : 8 + Math.random() * 20;
  const counterfeitScore = 100 - genuineScore;

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    imageUrl,
    imageName,
    imageSize,
    screeningStatus,
    demoMode: true,
    processingTimeMs: 1800 + Math.floor(Math.random() * 800),
    visualAnalysis: {
      genuineScore: parseFloat(genuineScore.toFixed(2)),
      counterfeitScore: parseFloat(counterfeitScore.toFixed(2)),
      classification,
      confidence: isGenuine ? 85 + Math.random() * 12 : 78 + Math.random() * 15,
      modelName: 'ResNet-18 + RBF-SVM',
      embeddingDimensions: 128,
    },
    ocrAnalysis:
      screeningStatus === 'inconclusive'
        ? {
            productName: { value: null, confidence: -1, detected: false },
            batchNumber: { value: null, confidence: -1, detected: false },
            manufacturingDate: { value: null, confidence: -1, detected: false },
            expiryDate: { value: null, confidence: -1, detected: false },
            overallConfidence: 0,
            medicineKeywords: [],
            rawText: '',
          }
        : {
            productName: {
              value: 'Paracetamol 500 mg',
              confidence: 94,
              detected: true,
            },
            batchNumber: {
              value: isGenuine ? 'B/N: PCT2409A' : null,
              confidence: isGenuine ? 81 : -1,
              detected: isGenuine,
            },
            manufacturingDate: {
              value: isGenuine ? 'Mfg: Sep 2024' : null,
              confidence: isGenuine ? 76 : -1,
              detected: isGenuine,
            },
            expiryDate: {
              value: 'Exp: Aug 2026',
              confidence: 88,
              detected: true,
            },
            overallConfidence: isGenuine ? 84.75 : 47.5,
            medicineKeywords: isGenuine
              ? ['Paracetamol', 'analgesic', 'antipyretic', '500 mg', 'tablets']
              : ['tablet', '500'],
            rawText: isGenuine
              ? 'Paracetamol Tablets IP 500mg | B/N: PCT2409A | Mfg: Sep 2024 | Exp: Aug 2026 | Store below 25°C | Keep out of reach of children'
              : 'tablet 500',
          },
    evidence: {
      visual: [
        {
          type: 'visual',
          label: 'Visual Classification',
          value: isGenuine ? 'Genuine packaging features detected' : 'Anomalous visual patterns detected',
          severity: isGenuine ? 'success' : 'error',
        },
        {
          type: 'visual',
          label: 'Confidence Level',
          value: `${isGenuine ? (85 + Math.random() * 12).toFixed(1) : (78 + Math.random() * 15).toFixed(1)}%`,
          severity: 'info',
        },
        {
          type: 'visual',
          label: 'Embedding Distance',
          value: isGenuine ? 'Within genuine cluster boundary' : 'Outside genuine cluster boundary',
          severity: isGenuine ? 'success' : 'warning',
        },
      ],
      ocr: screeningStatus === 'inconclusive'
        ? []
        : [
            {
              type: 'ocr',
              label: 'Product Name',
              value: 'Detected: Paracetamol 500 mg (confidence 94%)',
              severity: 'success',
            },
            {
              type: 'ocr',
              label: 'Expiry Date',
              value: 'Detected: Aug 2026',
              severity: 'success',
            },
            isGenuine
              ? {
                  type: 'ocr',
                  label: 'Batch Number',
                  value: 'Detected: PCT2409A',
                  severity: 'success',
                }
              : {
                  type: 'ocr',
                  label: 'Batch Number',
                  value: 'Not detected in packaging text',
                  severity: 'warning',
                },
          ],
      missing: screeningStatus === 'inconclusive'
        ? [
            { type: 'missing', label: 'Product Name', value: 'Not detected', severity: 'warning' },
            { type: 'missing', label: 'Batch Number', value: 'Not detected', severity: 'warning' },
            { type: 'missing', label: 'Manufacturing Date', value: 'Not detected', severity: 'warning' },
            { type: 'missing', label: 'Expiry Date', value: 'Not detected', severity: 'warning' },
          ]
        : isGenuine
        ? [
            { type: 'missing', label: 'Manufacturer Address', value: 'Not extracted from image', severity: 'info' },
          ]
        : [
            { type: 'missing', label: 'Batch Number', value: 'Not detected', severity: 'warning' },
            { type: 'missing', label: 'Manufacturing Date', value: 'Not detected', severity: 'warning' },
          ],
      warnings: [
        {
          type: 'warning',
          label: 'Demo Mode',
          value: 'This result is a simulated demonstration. No actual model inference was performed.',
          severity: 'warning',
        },
        {
          type: 'warning',
          label: 'Research Tool Disclaimer',
          value: 'This screening tool does not certify medicine authenticity. Always verify with the manufacturer.',
          severity: 'warning',
        },
        ...(!isGenuine
          ? [
              {
                type: 'warning' as const,
                label: 'Elevated Risk Detected',
                value: 'Visual features deviate significantly from genuine packaging patterns in the training dataset.',
                severity: 'error' as const,
              },
            ]
          : []),
      ],
    },
    recommendedAction:
      screeningStatus === 'elevated_risk'
        ? 'Do not rely on this result alone. Verify the product with the manufacturer or an authorized pharmacist.'
        : screeningStatus === 'inconclusive'
        ? 'Image quality or insufficient evidence prevented a reliable screening result. Try uploading a clearer image.'
        : 'No major visual warning was detected by this screening model. This does not guarantee authenticity.',
  } as AnalysisResult;
}

// ─── Exported mock API functions ─────────────────────────────────────────────

/**
 * Simulate medicine analysis with progressive stage updates.
 * Replace with: POST /api/analyze
 */
export async function runMockAnalysis(
  imageUrl: string,
  imageName: string,
  imageSize: number,
  onStageUpdate: (stages: ProcessingStage[]) => void,
): Promise<AnalysisResult> {
  const stages = getProcessingStages();
  const stageDurations = [300, 450, 350, 400, 500, 300];

  for (let i = 0; i < stages.length; i++) {
    stages[i].status = 'running';
    onStageUpdate([...stages]);
    await sleep(stageDurations[i]);
    stages[i].status = 'complete';
    stages[i].durationMs = stageDurations[i];
    onStageUpdate([...stages]);
  }

  // Randomly pick a result for demo purposes
  const roll = Math.random();
  const classification: VisualClassification = roll < 0.6 ? 'genuine' : 'counterfeit';
  const screeningStatus: ScreeningStatus =
    roll < 0.55 ? 'low_risk' : roll < 0.85 ? 'elevated_risk' : 'inconclusive';

  return buildMockResult(imageUrl, imageName, imageSize, classification, screeningStatus);
}

/**
 * Fetch analysis history.
 * Replace with: GET /api/history
 */
export async function fetchHistory(): Promise<HistoryRecord[]> {
  await sleep(300);
  return MOCK_HISTORY;
}

/**
 * Fetch a single analysis report by ID.
 * Replace with: GET /api/history/:id
 */
export async function fetchAnalysisById(id: string): Promise<AnalysisResult | null> {
  await sleep(200);
  const record = MOCK_HISTORY.find((r) => r.id === id);
  if (!record) return null;
  const cls = record.visualClassification;
  const status = record.screeningStatus;
  const result = buildMockResult(record.imageUrl, record.imageName, 0, cls, status);
  return {
    ...result,
    id: record.id,
    timestamp: record.timestamp,
    imageUrl: record.imageUrl,
    imageName: record.imageName,
  };
}

/**
 * Fetch model evaluation metrics.
 * Replace with: GET /api/model/metrics
 */
export async function fetchModelMetrics(): Promise<ModelMetrics> {
  await sleep(200);
  return {
    accuracy: 93.81,
    precision: 92.31,
    recall: 98.36,
    f1Score: 95.24,
    specificity: 86.11,
    balancedAccuracy: 92.24,
    rocAuc: 98.77,
    confusionMatrix: {
      truePositive: 31,
      falsePositive: 5,
      falseNegative: 1,
      trueNegative: 60,
    },
    datasetInfo: {
      total: 646,
      training: 452,
      validation: 97,
      testing: 97,
      syntheticForgeries: 1136,
    },
  };
}

/**
 * Fetch dashboard statistics.
 * Replace with: GET /api/dashboard/stats
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await sleep(200);
  return {
    totalAnalyses: MOCK_HISTORY.length,
    genuineClassifications: MOCK_HISTORY.filter(
      (r) => r.visualClassification === 'genuine',
    ).length,
    counterfeitClassifications: MOCK_HISTORY.filter(
      (r) => r.visualClassification === 'counterfeit',
    ).length,
    inconclusiveResults: MOCK_HISTORY.filter(
      (r) => r.screeningStatus === 'inconclusive',
    ).length,
    recentAnalyses: MOCK_HISTORY.slice(0, 5),
  };
}
