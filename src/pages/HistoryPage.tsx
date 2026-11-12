import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, FileSearch, ScanLine } from 'lucide-react';
import type { HistoryRecord } from '../types';
import { getHistory } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DemoBanner } from '../components/common/DemoBanner';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { formatDateTime, cn } from '../utils';

type SortKey = 'timestamp' | 'screeningStatus' | 'visualClassification' | 'confidence';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 5;

function SortHeader({
  label,
  col,
  current,
  dir,
  onClick,
}: {
  label: string;
  col: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (col: SortKey) => void;
}) {
  const active = current === col;
  const Icon = active && dir === 'asc' ? ChevronUp : ChevronDown;
  return (
    <button
      className={cn(
        'flex items-center gap-1 text-xs font-semibold uppercase tracking-wide hover:text-slate-800 transition-colors',
        active ? 'text-teal-600' : 'text-slate-500',
      )}
      onClick={() => onClick(col)}
    >
      {label}
      <Icon className={cn('w-3.5 h-3.5', active ? 'opacity-100' : 'opacity-30')} />
    </button>
  );
}

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getHistory()
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => {
        setLoadError('Unable to load analysis history. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleSort = (col: SortKey) => {
    if (sortKey === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col);
      setSortDir('desc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        const matchSearch =
          search === '' ||
          r.imageName.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          statusFilter === 'all' || r.screeningStatus === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'timestamp') cmp = a.timestamp.localeCompare(b.timestamp);
        else if (sortKey === 'screeningStatus') cmp = a.screeningStatus.localeCompare(b.screeningStatus);
        else if (sortKey === 'visualClassification') cmp = a.visualClassification.localeCompare(b.visualClassification);
        else if (sortKey === 'confidence') cmp = a.confidence - b.confidence;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [records, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingSpinner fullPage label="Loading history..." />;
  if (loadError) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">History Unavailable</h1>
          <p className="text-sm text-slate-500">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Analysis History</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {records.length} records · Demo data until backend is connected
        </p>
      </div>

      <div className="mb-5">
        <DemoBanner />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          <option value="all">All statuses</option>
          <option value="low_risk">Low Risk</option>
          <option value="elevated_risk">Elevated Risk</option>
          <option value="inconclusive">Inconclusive</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</span>
                </th>
                <th className="text-left px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Image</span>
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader label="Date" col="timestamp" current={sortKey} dir={sortDir} onClick={handleSort} />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader label="Visual" col="visualClassification" current={sortKey} dir={sortDir} onClick={handleSort} />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader label="Status" col="screeningStatus" current={sortKey} dir={sortDir} onClick={handleSort} />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader label="Confidence" col="confidence" current={sortKey} dir={sortDir} onClick={handleSort} />
                </th>
                <th className="text-right px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Report</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No results found"
                      description="Try adjusting your search or filters."
                      action={
                        <button
                          onClick={() => { setSearch(''); setStatusFilter('all'); }}
                          className="btn-secondary text-xs"
                        >
                          Clear filters
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                paged.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">{record.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileSearch className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <span className="text-xs text-slate-700 max-w-[140px] truncate" title={record.imageName}>
                          {record.imageName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(record.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.visualClassification} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.screeningStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          record.confidence >= 90
                            ? 'text-emerald-600'
                            : record.confidence >= 75
                            ? 'text-slate-700'
                            : 'text-amber-600',
                        )}
                      >
                        {record.confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/dashboard/history/view/${record.id}`}
                        className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
                        onClick={() => {
                          sessionStorage.setItem('viewHistoryId', record.id);
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'px-3 py-1 text-xs border rounded',
                    p === page
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New analysis CTA */}
      {records.length === 0 && (
        <div className="text-center mt-10">
          <Link to="/dashboard/analyze" className="btn-primary">
            <ScanLine className="w-4 h-4" />
            Run Your First Analysis
          </Link>
        </div>
      )}
    </div>
  );
}
