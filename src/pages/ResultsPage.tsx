import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  FileText,
  ArrowLeft,
  Download,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { AnalysisResult, EvidenceItem } from '../types';
import { formatDateTime, formatFileSize, cn } from '../utils';
import { StatusBadge } from '../components/common/StatusBadge';
import { DemoBanner } from '../components/common/DemoBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getAnalysisById } from '../services/api';

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function OcrFieldRow({
  label,
  value,
  confidence,
  detected,
}: {
  label: string;
  value: string | null;
  confidence: number;
  detected: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 text-right">
        {detected && value ? (
          <>
            <span className="text-sm text-slate-800">{value}</span>
            <span className="text-xs text-slate-400 ml-2">({confidence}% conf.)</span>
          </>
        ) : (
          <span className="text-sm text-slate-400 italic">Not detected</span>
        )}
      </div>
    </div>
  );
}

const evidenceIcons = {
  info: Info,
  warning: AlertTriangle,
  error: X,
  success: CheckCircle2,
};

const evidenceColors = {
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  warning: 'text-amber-700 bg-amber-50 border-amber-200',
  error: 'text-red-700 bg-red-50 border-red-200',
  success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

const evidenceIconColors = {
  info: 'text-blue-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  success: 'text-emerald-500',
};

function EvidenceRow({ item }: { item: EvidenceItem }) {
  const severity = item.severity || 'info';
  const Icon = evidenceIcons[severity];
  return (
    <div className={cn('flex items-start gap-2 p-2.5 rounded border text-xs', evidenceColors[severity])}>
      <Icon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', evidenceIconColors[severity])} />
      <div>
        <span className="font-medium">{item.label}: </span>
        {item.value}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'low_risk') return <CheckCircle2 className="w-10 h-10 text-emerald-500" />;
  if (status === 'elevated_risk') return <AlertCircle className="w-10 h-10 text-red-500" />;
  return <HelpCircle className="w-10 h-10 text-amber-500" />;
}

const statusBg = {
  low_risk: 'bg-emerald-50 border-emerald-200',
  elevated_risk: 'bg-red-50 border-red-200',
  inconclusive: 'bg-amber-50 border-amber-200',
};

const statusText = {
  low_risk: 'Low Screening Risk',
  elevated_risk: 'Elevated Screening Risk',
  inconclusive: 'Analysis Inconclusive',
};

function readStoredResult(): AnalysisResult | null {
  const stored = sessionStorage.getItem('lastAnalysisResult');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AnalysisResult;
  } catch {
    return null;
  }
}

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(() => (id ? null : readStoredResult()));
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    if (id) {
      getAnalysisById(id)
        .then((analysis) => {
          if (!active) return;
          if (analysis) {
            setResult(analysis);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => {
          if (active) setNotFound(true);
        });
      return () => {
        active = false;
      };
    }

    if (!result) {
      navigate('/dashboard/analyze');
    }
    return () => {
      active = false;
    };
  }, [id, navigate, result]);

  if (notFound) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Report Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The requested analysis report does not exist or is no longer available.
          </p>
          <Link to="/dashboard/history" className="btn-primary">
            Back to Analysis History
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return <LoadingSpinner fullPage label="Loading screening report..." />;

  const handleDownload = () => {
    const content = `
COUNTERFEIT MEDICINE SCREENING REPORT
======================================
Report ID     : ${result.id}
Generated     : ${formatDateTime(result.timestamp)}
Demo Mode     : ${result.demoMode ? 'Yes – Simulated result, not real model inference' : 'No'}

OVERALL SCREENING RESULT
------------------------
Status        : ${statusText[result.screeningStatus]}
Image         : ${result.imageName} (${formatFileSize(result.imageSize)})

VISUAL ANALYSIS (ResNet-18 + RBF-SVM)
--------------------------------------
Classification   : ${result.visualAnalysis.classification.toUpperCase()}
Genuine Score    : ${result.visualAnalysis.genuineScore.toFixed(1)}%
Counterfeit Score: ${result.visualAnalysis.counterfeitScore.toFixed(1)}%
Confidence       : ${result.visualAnalysis.confidence.toFixed(1)}%
Embedding Dims   : ${result.visualAnalysis.embeddingDimensions}

OCR EVIDENCE (EasyOCR)
-----------------------
Product Name  : ${result.ocrAnalysis.productName.detected ? result.ocrAnalysis.productName.value : 'Not detected'}
Batch Number  : ${result.ocrAnalysis.batchNumber.detected ? result.ocrAnalysis.batchNumber.value : 'Not detected'}
Mfg Date      : ${result.ocrAnalysis.manufacturingDate.detected ? result.ocrAnalysis.manufacturingDate.value : 'Not detected'}
Exp Date      : ${result.ocrAnalysis.expiryDate.detected ? result.ocrAnalysis.expiryDate.value : 'Not detected'}
OCR Confidence: ${result.ocrAnalysis.overallConfidence.toFixed(1)}%
Keywords      : ${result.ocrAnalysis.medicineKeywords.join(', ') || 'None detected'}

RECOMMENDED ACTION
------------------
${result.recommendedAction}

DISCLAIMER
----------
This tool is a research prototype. Results do not certify medicine authenticity.
Always verify with the manufacturer, pharmacist, or regulatory authority.
Processing time: ${result.processingTimeMs}ms
`.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CMD-Report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard/analyze" className="btn-secondary text-xs px-3 py-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          New Analysis
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-slate-900">Screening Report</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {result.id} · {formatDateTime(result.timestamp)}
          </p>
        </div>
        <button onClick={handleDownload} className="btn-secondary text-xs px-3 py-1.5">
          <Download className="w-3.5 h-3.5" />
          Download Report
        </button>
      </div>

      {result.demoMode && (
        <div className="mb-5">
          <DemoBanner />
        </div>
      )}

      {/* Overall result banner */}
      <div className={cn('border rounded-lg p-5 mb-6 flex items-start gap-4', statusBg[result.screeningStatus])}>
        <StatusIcon status={result.screeningStatus} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {statusText[result.screeningStatus]}
            </h2>
            <StatusBadge status={result.screeningStatus} size="md" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
            {result.recommendedAction}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span>Processing: {result.processingTimeMs}ms</span>
            <span>File: {result.imageName}</span>
            {result.imageSize > 0 && <span>Size: {formatFileSize(result.imageSize)}</span>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visual Analysis */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-800">Visual Analysis</h3>
            <span className="ml-auto text-xs text-slate-400">
              {result.visualAnalysis.modelName}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-md border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Classification</p>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={result.visualAnalysis.classification}
                  size="md"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-0.5">Confidence</p>
              <p className="text-lg font-bold text-slate-900">
                {result.visualAnalysis.confidence.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <ScoreBar
              label="Genuine Score"
              value={result.visualAnalysis.genuineScore}
              color="bg-emerald-500"
            />
            <ScoreBar
              label="Counterfeit Score"
              value={result.visualAnalysis.counterfeitScore}
              color="bg-red-400"
            />
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span className="font-medium text-slate-500">Embedding:</span>{' '}
            {result.visualAnalysis.embeddingDimensions}-dimensional triplet-learned space
          </div>
        </div>

        {/* OCR Analysis */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-800">OCR Evidence</h3>
            <span className="ml-auto text-xs text-slate-400">EasyOCR</span>
          </div>

          <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Overall OCR Confidence</span>
            <span className="text-lg font-bold text-slate-900">
              {result.ocrAnalysis.overallConfidence > 0
                ? `${result.ocrAnalysis.overallConfidence.toFixed(1)}%`
                : 'N/A'}
            </span>
          </div>

          <div className="mb-4">
            <OcrFieldRow
              label="Product Name"
              value={result.ocrAnalysis.productName.value}
              confidence={result.ocrAnalysis.productName.confidence}
              detected={result.ocrAnalysis.productName.detected}
            />
            <OcrFieldRow
              label="Batch Number"
              value={result.ocrAnalysis.batchNumber.value}
              confidence={result.ocrAnalysis.batchNumber.confidence}
              detected={result.ocrAnalysis.batchNumber.detected}
            />
            <OcrFieldRow
              label="Manufacturing Date"
              value={result.ocrAnalysis.manufacturingDate.value}
              confidence={result.ocrAnalysis.manufacturingDate.confidence}
              detected={result.ocrAnalysis.manufacturingDate.detected}
            />
            <OcrFieldRow
              label="Expiry Date"
              value={result.ocrAnalysis.expiryDate.value}
              confidence={result.ocrAnalysis.expiryDate.confidence}
              detected={result.ocrAnalysis.expiryDate.detected}
            />
          </div>

          {result.ocrAnalysis.medicineKeywords.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Detected keywords</p>
              <div className="flex flex-wrap gap-1">
                {result.ocrAnalysis.medicineKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Summary */}
      <div className="card p-5 mt-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Evidence Summary</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Visual Evidence', items: result.evidence.visual },
            { title: 'OCR Evidence', items: result.evidence.ocr },
            { title: 'Missing Information', items: result.evidence.missing },
            { title: 'Warnings & Limitations', items: result.evidence.warnings },
          ].map(({ title, items }) => (
            <div key={title}>
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                {title}
              </p>
              <div className="space-y-1.5">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">None</p>
                ) : (
                  items.map((item, i) => <EvidenceRow key={i} item={item} />)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw OCR text */}
      {result.ocrAnalysis.rawText && (
        <div className="card p-5 mt-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Raw OCR Text</h3>
          <pre className="text-xs text-slate-600 bg-slate-50 rounded p-3 border border-slate-100 whitespace-pre-wrap font-mono">
            {result.ocrAnalysis.rawText}
          </pre>
        </div>
      )}
    </div>
  );
}
