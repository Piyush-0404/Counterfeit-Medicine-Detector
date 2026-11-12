import { useEffect, useState } from 'react';
import type { ModelMetrics } from '../types';
import { getModelMetrics } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`metric-card ${highlight ? 'ring-2 ring-teal-500 ring-offset-1' : ''}`}>
      <div className="text-2xl font-bold text-teal-600 mb-1">{value.toFixed(2)}%</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function ModelPerformancePage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getModelMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => {
        setLoadError('Unable to load model metrics. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner fullPage label="Loading model metrics..." />;
  if (loadError) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Metrics Unavailable</h1>
          <p className="text-sm text-slate-500">{loadError}</p>
        </div>
      </div>
    );
  }
  if (!metrics) return null;

  const { confusionMatrix: cm, datasetInfo: ds } = metrics;

  const metricList = [
    { label: 'Accuracy', value: metrics.accuracy },
    { label: 'Precision', value: metrics.precision },
    { label: 'Recall', value: metrics.recall },
    { label: 'F1-Score', value: metrics.f1Score, highlight: true },
    { label: 'Specificity', value: metrics.specificity },
    { label: 'Balanced Accuracy', value: metrics.balancedAccuracy },
    { label: 'ROC-AUC', value: metrics.rocAuc, highlight: true },
  ];

  const radarData = [
    { metric: 'Accuracy', value: metrics.accuracy },
    { metric: 'Precision', value: metrics.precision },
    { metric: 'Recall', value: metrics.recall },
    { metric: 'F1-Score', value: metrics.f1Score },
    { metric: 'Specificity', value: metrics.specificity },
    { metric: 'ROC-AUC', value: metrics.rocAuc },
  ];

  const valTestData = [
    { name: 'Accuracy', validation: 91.75, test: metrics.accuracy },
    { name: 'F1-Score', validation: 93.11, test: metrics.f1Score },
    { name: 'Recall', validation: 96.88, test: metrics.recall },
    { name: 'ROC-AUC', validation: 97.42, test: metrics.rocAuc },
  ];

  const datasetChart = [
    { name: 'Training', value: ds.training, fill: '#0d9488' },
    { name: 'Validation', value: ds.validation, fill: '#14b8a6' },
    { name: 'Testing', value: ds.testing, fill: '#5eead4' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Model Performance</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Research evaluation on locked test dataset · 97 images · Zero hash overlap between splits
        </p>
      </div>

      {/* Important context */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-6">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Research Dataset Results</p>
          <p className="text-xs leading-relaxed">
            All metrics below are measured on a controlled, cleaned research dataset of 646 unique images. These figures reflect project evaluation performance and should not be interpreted as guaranteed real-world detection accuracy. The model was not tested on certified counterfeit medicines.
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
        {metricList.map(({ label, value, highlight }) => (
          <MetricCard key={label} label={label} value={value} highlight={highlight} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Confusion matrix */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Confusion Matrix</h2>
          <p className="text-xs text-slate-400 mb-5">Locked test set · 97 samples</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2" />
                  <th className="p-2 text-xs text-slate-500 font-semibold">Pred. Genuine</th>
                  <th className="p-2 text-xs text-slate-500 font-semibold">Pred. Counterfeit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-xs text-slate-500 font-semibold text-left">Actual Genuine</td>
                  <td className="p-2">
                    <div className="w-16 h-16 mx-auto rounded flex items-center justify-center bg-emerald-100 border border-emerald-300">
                      <div>
                        <div className="text-xl font-bold text-emerald-700">{cm.truePositive}</div>
                        <div className="text-xs text-emerald-600">TP</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="w-16 h-16 mx-auto rounded flex items-center justify-center bg-red-50 border border-red-200">
                      <div>
                        <div className="text-xl font-bold text-red-600">{cm.falsePositive}</div>
                        <div className="text-xs text-red-500">FP</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-xs text-slate-500 font-semibold text-left">Actual Counterfeit</td>
                  <td className="p-2">
                    <div className="w-16 h-16 mx-auto rounded flex items-center justify-center bg-red-50 border border-red-200">
                      <div>
                        <div className="text-xl font-bold text-red-600">{cm.falseNegative}</div>
                        <div className="text-xs text-red-500">FN</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="w-16 h-16 mx-auto rounded flex items-center justify-center bg-emerald-100 border border-emerald-300">
                      <div>
                        <div className="text-xl font-bold text-emerald-700">{cm.trueNegative}</div>
                        <div className="text-xs text-emerald-600">TN</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {cm.truePositive + cm.trueNegative} correct
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              {cm.falsePositive + cm.falseNegative} errors
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Performance Radar</h2>
          <p className="text-xs text-slate-400 mb-4">All metrics on locked test set</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Validation vs Test */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-semibold text-slate-800">Validation vs Test Performance</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={valTestData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' ? `${value.toFixed(2)}%` : '—',
              ]}
              contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="validation" name="Validation" fill="#5eead4" radius={[2, 2, 0, 0]} />
            <Bar dataKey="test" name="Test" fill="#0d9488" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dataset info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Dataset Splits</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={datasetChart} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              <Bar dataKey="value" name="Images" radius={[0, 2, 2, 0]}>
                {datasetChart.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Total unique: <strong className="text-slate-800">{ds.total}</strong></div>
            <div>Training: <strong className="text-slate-800">{ds.training}</strong></div>
            <div>Validation: <strong className="text-slate-800">{ds.validation}</strong></div>
            <div>Testing: <strong className="text-slate-800">{ds.testing}</strong></div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Architecture Summary</h2>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Backbone', value: 'ResNet-18 (pretrained, ImageNet)' },
              { label: 'Embedding', value: '128-dimensional · Triplet loss training' },
              { label: 'Classifier', value: 'RBF-SVM (C=10, γ=0.001)' },
              { label: 'OCR Engine', value: 'EasyOCR · Multi-field extraction' },
              { label: 'Synthetic forgeries', value: `${ds.syntheticForgeries.toLocaleString()} images from 284 genuine` },
              { label: 'Split leakage', value: 'Zero exact-hash overlap verified' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800 font-medium text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
