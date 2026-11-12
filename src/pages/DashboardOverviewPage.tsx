import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStats } from '../types';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DemoBanner } from '../components/common/DemoBanner';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDateTime } from '../utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoadError('Unable to load dashboard statistics. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner fullPage label="Loading dashboard..." />;
  if (loadError) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Dashboard Unavailable</h1>
          <p className="text-sm text-slate-500">{loadError}</p>
        </div>
      </div>
    );
  }
  if (!stats) return null;

  const chartData = [
    { name: 'Genuine', value: stats.genuineClassifications, color: '#059669' },
    { name: 'Counterfeit', value: stats.counterfeitClassifications, color: '#dc2626' },
    { name: 'Inconclusive', value: stats.inconclusiveResults, color: '#d97706' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's a summary of recent activity.</p>
      </div>

      <div className="mb-5">
        <DemoBanner />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Analyses',
            value: stats.totalAnalyses,
            icon: ScanLine,
            iconClass: 'text-teal-600 bg-teal-50',
          },
          {
            label: 'Low Risk',
            value: stats.genuineClassifications,
            icon: CheckCircle2,
            iconClass: 'text-emerald-600 bg-emerald-50',
          },
          {
            label: 'Elevated Risk',
            value: stats.counterfeitClassifications,
            icon: AlertCircle,
            iconClass: 'text-red-600 bg-red-50',
          },
          {
            label: 'Inconclusive',
            value: stats.inconclusiveResults,
            icon: HelpCircle,
            iconClass: 'text-amber-600 bg-amber-50',
          },
        ].map(({ label, value, icon: Icon, iconClass }) => (
          <div key={label} className="card p-5">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${iconClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Pie chart */}
        <div className="md:col-span-2 card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Result Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [typeof value === 'number' ? value : 0, 'Analyses']}
                contentStyle={{
                  fontSize: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent analyses */}
        <div className="md:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Recent Analyses</h2>
            <Link
              to="/dashboard/history"
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentAnalyses.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-800 truncate">{r.imageName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(r.timestamp)}</p>
                </div>
                <StatusBadge status={r.screeningStatus} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link
          to="/dashboard/analyze"
          className="card p-5 hover:shadow-card-hover transition-shadow flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
            <ScanLine className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">New Analysis</p>
            <p className="text-xs text-slate-500">Upload medicine packaging image</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
        </Link>
        <Link
          to="/dashboard/performance"
          className="card p-5 hover:shadow-card-hover transition-shadow flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Model Performance</p>
            <p className="text-xs text-slate-500">View research evaluation metrics</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
        </Link>
      </div>
    </div>
  );
}
