import { cn } from '../../utils';

interface BadgeProps {
  status: 'low_risk' | 'elevated_risk' | 'inconclusive' | 'genuine' | 'counterfeit';
  size?: 'sm' | 'md';
}

const styles: Record<string, string> = {
  low_risk: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  elevated_risk: 'bg-red-50 text-red-700 border-red-200',
  inconclusive: 'bg-amber-50 text-amber-700 border-amber-200',
  genuine: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  counterfeit: 'bg-red-50 text-red-700 border-red-200',
};

const labels: Record<string, string> = {
  low_risk: 'Low Risk',
  elevated_risk: 'Elevated Risk',
  inconclusive: 'Inconclusive',
  genuine: 'Genuine',
  counterfeit: 'Counterfeit',
};

const dots: Record<string, string> = {
  low_risk: 'bg-emerald-500',
  elevated_risk: 'bg-red-500',
  inconclusive: 'bg-amber-500',
  genuine: 'bg-emerald-500',
  counterfeit: 'bg-red-500',
};

export function StatusBadge({ status, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded',
        styles[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      )}
    >
      <span className={cn('rounded-full flex-shrink-0', dots[status], size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {labels[status]}
    </span>
  );
}
