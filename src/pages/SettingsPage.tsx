import { Link } from 'react-router-dom';
import { Bell, Shield, Info } from 'lucide-react';
import { DemoBanner } from '../components/common/DemoBanner';

export function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Application configuration and preferences.</p>
      </div>

      <div className="mb-5">
        <DemoBanner message="Settings are not persisted in demo mode." />
      </div>

      <div className="space-y-4">
        {/* Backend config */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-800">Backend Configuration</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label">API Base URL</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., http://localhost:8000"
                disabled
              />
              <p className="text-xs text-slate-400 mt-1">
                Set <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">VITE_API_BASE_URL</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.env</code> file to connect to the FastAPI backend.
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-700">Backend Status</p>
                <p className="text-xs text-slate-400 mt-0.5">No backend connected</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-medium">
                Demo Mode
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Show analysis completion notifications', defaultChecked: true },
              { label: 'Show elevated risk alerts', defaultChecked: true },
              { label: 'Show demo mode reminder on each result', defaultChecked: true },
            ].map(({ label, defaultChecked }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={defaultChecked}
                  className="w-4 h-4 text-teal-600 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-800">About</h2>
          </div>
          <div className="space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Version</span><span className="text-slate-700">1.0.0 (Demo)</span>
            </div>
            <div className="flex justify-between">
              <span>Stack</span><span className="text-slate-700">React + TypeScript + Vite + Tailwind</span>
            </div>
            <div className="flex justify-between">
              <span>Project</span><span className="text-slate-700">B.Tech AI & Data Science</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/about-project" className="btn-secondary text-xs px-3 py-1.5">
              View Full Project Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
