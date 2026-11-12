import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Upload,
  Cpu,
  FileText,
  ClipboardList,
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  ScanLine,
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

const metrics = [
  { label: 'Accuracy', value: '93.81%' },
  { label: 'Recall', value: '98.36%' },
  { label: 'F1-Score', value: '95.24%' },
  { label: 'ROC-AUC', value: '98.77%' },
];

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Medicine Image',
    desc: 'Drag and drop or browse to upload a photo of the medicine packaging (JPG, PNG, WEBP).',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Visual AI Analysis',
    desc: 'ResNet-18 extracts deep visual features. Triplet learning maps them to a 128-dimensional embedding space.',
  },
  {
    step: '03',
    icon: FileText,
    title: 'OCR Text Extraction',
    desc: 'EasyOCR reads product name, batch number, manufacturing date, expiry date, and medicine-related keywords.',
  },
  {
    step: '04',
    icon: ClipboardList,
    title: 'Screening Report',
    desc: 'RBF-SVM classifies the embedding. Visual and OCR evidence are combined into a detailed screening report.',
  },
];

const technologies = [
  {
    name: 'ResNet-18',
    role: 'Visual Feature Extraction',
    desc: 'Pretrained deep convolutional neural network that extracts rich visual features from medicine packaging images.',
  },
  {
    name: 'Triplet Learning',
    role: 'Embedding Space',
    desc: 'Learns a 128-dimensional metric space where genuine and counterfeit medicines are maximally separated.',
  },
  {
    name: 'RBF-SVM',
    role: 'Classification',
    desc: 'Radial basis function support vector machine that classifies the learned embeddings with high precision.',
  },
  {
    name: 'EasyOCR',
    role: 'Text Evidence',
    desc: 'Optical character recognition engine that reads packaging text as supporting evidence for the screening decision.',
  },
];

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium mb-6">
              <Shield className="w-3 h-3" />
              B.Tech AI & Data Science Research Project
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Screen Medicines.<br />
              <span className="text-teal-600">Identify Packaging</span> Risks.
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              AI-powered visual analysis and OCR text evidence to screen medicine packaging for counterfeit risk indicators. Built on ResNet-18, Triplet Learning, and RBF-SVM.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/analyze" className="btn-primary text-base px-5 py-2.5">
                Analyze Medicine
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-5 py-2.5">
                Explore How It Works
              </a>
            </div>
          </div>

          {/* Visual Scan Illustration */}
          <div className="relative hidden md:flex items-center justify-center">
            <div className="w-72 h-72 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden">
              {/* Simulated packaging outline */}
              <div className="w-48 h-56 rounded-lg border-2 border-teal-200 bg-white relative flex flex-col items-center justify-center gap-2 shadow-sm">
                <div className="w-28 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-3 bg-slate-100 rounded" />
                <div className="mt-2 w-10 h-10 rounded bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-500" />
                </div>
                <div className="mt-2 space-y-1 w-full px-4">
                  <div className="w-full h-2 bg-slate-100 rounded" />
                  <div className="w-3/4 h-2 bg-slate-100 rounded" />
                  <div className="w-5/6 h-2 bg-slate-100 rounded" />
                </div>
              </div>
              {/* Scan line */}
              <div className="absolute inset-x-4 h-0.5 bg-teal-400 opacity-60 top-1/2 -translate-y-1/2" />
              <ScanLine className="absolute top-4 right-4 w-5 h-5 text-teal-500 opacity-60" />
              {/* Corner markers */}
              {[
                'top-2 left-2',
                'top-2 right-2',
                'bottom-2 left-2',
                'bottom-2 right-2',
              ].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-4 h-4 border-teal-500 border-l-2 border-t-2`}
                  style={
                    pos.includes('right')
                      ? { borderLeft: 'none', borderRight: '2px solid #14b8a6', borderTop: '2px solid #14b8a6' }
                      : pos.includes('bottom')
                      ? { borderTop: 'none', borderBottom: '2px solid #14b8a6' }
                      : {}
                  }
                />
              ))}
            </div>
            {/* Floating labels */}
            <div className="absolute -right-4 top-16 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-card text-xs">
              <span className="text-slate-500">Visual Score</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-emerald-600 font-semibold">91.4%</span>
                <span className="text-slate-400">genuine</span>
              </div>
            </div>
            <div className="absolute -left-4 bottom-16 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-card text-xs">
              <span className="text-slate-500">OCR Fields</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Eye className="w-3 h-3 text-teal-500" />
                <span className="text-slate-700 font-medium">4 / 4 detected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-t border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-1">Four stages from image upload to screening result.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-xs font-mono text-slate-300 mb-3">{step}</div>
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology ──────────────────────────────────────────────── */}
      <section id="technology" className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Technology Stack</h2>
            <p className="text-slate-500 mt-1">Four components powering the detection pipeline.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {technologies.map(({ name, role, desc }) => (
              <div key={name} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
                      <span className="text-xs px-1.5 py-0.5 bg-teal-50 text-teal-600 border border-teal-200 rounded">{role}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Performance ─────────────────────────────────────── */}
      <section id="performance" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Research Performance</h2>
            <p className="text-slate-500 mt-1">
              Evaluation results on the locked test dataset (97 images, zero leakage between splits).
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {metrics.map(({ label, value }) => (
              <div key={label} className="card p-5 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              These metrics were measured on a controlled, cleaned research dataset. They reflect project evaluation results and should not be interpreted as guaranteed real-world detection accuracy.
            </span>
          </div>
          <div className="mt-6 text-center">
            <Link to="/dashboard/performance" className="btn-secondary inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              View Full Performance Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────────────── */}
      <section id="disclaimer" className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Important Disclaimer</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            This tool is a <strong>research prototype</strong> developed as part of a B.Tech AI & Data Science project. It provides AI-based visual screening results only and <strong>does not certify the authenticity of any medicine</strong>.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Results must not be used as a substitute for professional medical or pharmaceutical verification. If you suspect a counterfeit medicine, contact the manufacturer, your pharmacist, or the relevant regulatory authority.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
