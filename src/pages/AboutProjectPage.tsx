import {
  Database,
  Filter,
  Layers,
  Shuffle,
  Brain,
  Triangle,
  ScanLine,
  FileText,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';

const methodology = [
  {
    step: '01',
    icon: Database,
    title: 'Dataset Collection',
    desc: 'Medicine packaging images collected from publicly available pharmaceutical sources and direct photography. Images span multiple drug categories, manufacturers, and packaging formats.',
  },
  {
    step: '02',
    icon: Filter,
    title: 'Duplicate Removal & Leakage Prevention',
    desc: 'Exact-hash deduplication reduced the dataset to 646 unique images. Train/validation/test splits were constructed with zero hash overlap to prevent data leakage.',
  },
  {
    step: '03',
    icon: Layers,
    title: 'Image Preprocessing',
    desc: 'Images were resized to 224×224 pixels, normalized using ImageNet channel statistics (mean and std), and augmented during training with horizontal flipping and color jitter.',
  },
  {
    step: '04',
    icon: Shuffle,
    title: 'Synthetic Forgery Generation',
    desc: '1,136 synthetic counterfeit images were generated from 284 genuine training images using four perturbation types: color shift, print degradation, misalignment, and combined perturbations. These are controlled training examples — not verified real counterfeit products.',
  },
  {
    step: '05',
    icon: Brain,
    title: 'ResNet-18 Feature Extraction',
    desc: 'A pretrained ResNet-18 backbone (ImageNet weights) was used to extract high-level visual features from each packaging image, capturing texture, logo, color patterns, and print quality.',
  },
  {
    step: '06',
    icon: Triangle,
    title: 'Triplet Learning',
    desc: 'The feature extractor was fine-tuned using triplet loss to learn a 128-dimensional embedding space where genuine medicine images cluster closely and are separated from counterfeit samples.',
  },
  {
    step: '07',
    icon: ScanLine,
    title: 'RBF-SVM Classification',
    desc: 'A radial basis function support vector machine was trained on the learned embeddings to produce the final binary classification: genuine or counterfeit. The SVM was optimized via grid search.',
  },
  {
    step: '08',
    icon: FileText,
    title: 'OCR Evidence Extraction',
    desc: 'EasyOCR was applied to each packaging image to extract text evidence: product name, batch number, manufacturing date, expiry date, and medicine-related keywords. OCR results serve as a supporting evidence layer, not the primary classifier.',
  },
  {
    step: '09',
    icon: ClipboardCheck,
    title: 'Evaluation',
    desc: 'The model was evaluated on the locked test set (97 images, never seen during training or validation). Accuracy: 93.81%, Recall: 98.36%, F1-score: 95.24%, ROC-AUC: 98.77%.',
  },
];

const forgeryTypes = [
  { label: 'Color Shift', desc: 'Alters hue, saturation, and brightness to simulate poor printing or faded packaging.' },
  { label: 'Print Degradation', desc: 'Adds Gaussian blur, noise, and compression artifacts simulating low-quality printing.' },
  { label: 'Misalignment', desc: 'Introduces small rotations and translations to simulate packaging printing errors.' },
  { label: 'Combined', desc: 'Applies two or more perturbations simultaneously to create more complex forgery patterns.' },
];

export function AboutProjectPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">About the Project</h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            Counterfeit Medicine Detector is a B.Tech AI & Data Science final-year research project. It applies deep learning, metric learning, and OCR to screen medicine packaging images for counterfeit risk indicators.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* System overview */}
        <div className="card p-6 mb-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">System Overview</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Primary Classifier</h3>
              <p className="text-slate-600 leading-relaxed">
                ResNet-18 extracts visual features. Triplet learning maps them to a 128-dimensional embedding space. An RBF-SVM classifies the embedding as Genuine or Counterfeit.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Supporting Evidence</h3>
              <p className="text-slate-600 leading-relaxed">
                EasyOCR reads packaging text to extract product name, batch number, manufacturing date, expiry date, and medicine-related keywords. These support but do not override the visual classifier.
              </p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Methodology</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 hidden md:block" />
          <div className="space-y-6">
            {methodology.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{step}</span>
                    <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthetic forgeries */}
        <div className="card p-6 mt-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-0.5">Synthetic Forgery Generation</h2>
              <p className="text-xs text-slate-500">
                1,136 synthetic counterfeit images generated from 284 genuine training images
              </p>
            </div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 mb-5">
            Synthetic forgeries are controlled training examples created to teach the model visual deviation patterns. They are <strong>not verified real counterfeit medicines</strong> and do not represent actual pharmaceutical fraud cases.
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {forgeryTypes.map(({ label, desc }) => (
              <div key={label} className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research limitations */}
        <div className="card p-6 mt-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Research Limitations</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              'Dataset limited to 646 unique images — results may not generalize across all medicine types.',
              'Counterfeit samples are synthetically generated, not verified real-world counterfeits.',
              'OCR accuracy depends heavily on image quality and packaging font clarity.',
              'Model trained on specific visual patterns; novel packaging designs may reduce accuracy.',
              'Real-world lighting, camera quality, and angle variations are not fully represented in the dataset.',
              'This tool provides screening indicators only and must not be used for clinical or regulatory decisions.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-slate-300 mt-1">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
