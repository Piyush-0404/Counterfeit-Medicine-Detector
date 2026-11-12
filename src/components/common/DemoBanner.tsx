import { AlertTriangle } from 'lucide-react';

interface DemoBannerProps {
  message?: string;
}

export function DemoBanner({ message }: DemoBannerProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span>
        <span className="font-semibold">Demo Mode:</span>{' '}
        {message ||
          'No backend is connected. Results shown are simulated demonstrations and do not reflect actual model inference.'}
      </span>
    </div>
  );
}
