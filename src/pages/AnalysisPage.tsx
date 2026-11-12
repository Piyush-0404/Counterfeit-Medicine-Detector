import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  FileImage,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react';
import type { ProcessingStage } from '../types';
import { analyzeImage } from '../services/api';
import { getProcessingStages } from '../services/mockApi';
import { formatFileSize, cn } from '../utils';
import { DemoBanner } from '../components/common/DemoBanner';
import { useToast } from '../components/common/toastContext';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png, .webp';
const MAX_SIZE_MB = 10;

function StageIndicator({ stages }: { stages: ProcessingStage[] }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Processing Pipeline</h3>
      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-start gap-3">
            {stage.status === 'complete' ? (
              <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
            ) : stage.status === 'running' ? (
              <Loader2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0 animate-spin" />
            ) : stage.status === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-slate-200 mt-0.5 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  stage.status === 'complete'
                    ? 'text-teal-700'
                    : stage.status === 'running'
                    ? 'text-slate-800'
                    : 'text-slate-400',
                )}
              >
                {stage.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{stage.description}</p>
              {stage.status === 'complete' && stage.durationMs && (
                <p className="text-xs text-teal-600 mt-0.5">{stage.durationMs}ms</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stages, setStages] = useState<ProcessingStage[]>(getProcessingStages);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return `Unsupported file type. Please upload ${ACCEPTED_EXTENSIONS}.`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      showToast('error', err);
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, [showToast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    setStages(getProcessingStages());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeImage(file, (updatedStages) => {
        setStages(updatedStages);
      });
      // Store result and navigate
      sessionStorage.setItem('lastAnalysisResult', JSON.stringify(result));
      showToast('success', 'Analysis complete. Viewing your screening report.');
      navigate('/dashboard/result');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
      showToast('error', msg);
      setStages(getProcessingStages());
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">New Analysis</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Upload a medicine packaging image to begin AI-based counterfeit risk screening.
        </p>
      </div>

      <div className="mb-5">
        <DemoBanner />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload area */}
        <div className="md:col-span-2 space-y-4">
          {/* Drop zone */}
          {!file ? (
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer',
                isDragging
                  ? 'border-teal-400 bg-teal-50'
                  : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50',
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              aria-label="Upload medicine image"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                className="hidden"
                onChange={handleInputChange}
                aria-label="Choose image file"
              />
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Drag and drop your image here
              </p>
              <p className="text-xs text-slate-400 mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-slate-400">
                Accepted: JPG, JPEG, PNG, WEBP · Max {MAX_SIZE_MB} MB
              </p>
            </div>
          ) : (
            /* Image preview */
            <div className="card overflow-hidden">
              <div className="relative bg-slate-100 border-b border-slate-200">
                <img
                  src={preview!}
                  alt="Medicine packaging preview"
                  className="w-full max-h-72 object-contain py-4"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-300 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="px-4 py-3 flex items-center gap-3">
                <FileImage className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className={cn(
              'w-full btn-primary justify-center py-2.5 text-sm',
              (!file || isAnalyzing) && 'opacity-50 cursor-not-allowed',
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Medicine'
            )}
          </button>

          {/* Info note */}
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              For best results, upload a clear, well-lit photo of the medicine's front label or blister pack. Avoid blurry or cropped images.
            </span>
          </div>
        </div>

        {/* Processing stages sidebar */}
        <div>
          <StageIndicator stages={stages} />
        </div>
      </div>
    </div>
  );
}
