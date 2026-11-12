import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  ScanLine,
  History,
  BarChart2,
  BookOpen,
  Settings,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'New Analysis', href: '/dashboard/analyze', icon: ScanLine },
  { label: 'Analysis History', href: '/dashboard/history', icon: History },
  { label: 'Model Performance', href: '/dashboard/performance', icon: BarChart2 },
  { label: 'About the Project', href: '/about-project', icon: BookOpen },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  children: React.ReactNode;
}

interface SidebarContentProps {
  isActive: (item: (typeof navItems)[number]) => boolean;
  onNavigate: () => void;
}

function SidebarContent({ isActive, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-200">
        <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-800 leading-tight truncate">Counterfeit Medicine</p>
          <p className="text-xs text-teal-600 leading-tight">Detector</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-teal-600' : 'text-slate-400')} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-teal-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-200">
        <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Home
        </Link>
        <p className="text-xs text-slate-400 mt-1">Demo Mode · No backend</p>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 flex flex-col w-56 bg-white h-full shadow-xl">
            <button
              className="absolute top-3 right-3 p-1.5 rounded text-slate-400 hover:text-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-slate-200">
          <button
            className="p-1.5 rounded text-slate-500 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-slate-800">CMD</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
