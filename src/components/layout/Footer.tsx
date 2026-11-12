import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">CMD</span>
            </div>
            <p className="text-xs leading-relaxed">
              AI-based counterfeit medicine screening research project. B.Tech AI & Data Science.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Project</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/#technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="/#performance" className="hover:text-white transition-colors">Performance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/analyze" className="hover:text-white transition-colors">New Analysis</Link></li>
              <li><Link to="/dashboard/history" className="hover:text-white transition-colors">History</Link></li>
              <li><Link to="/dashboard/performance" className="hover:text-white transition-colors">Model Performance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><Link to="/about-project" className="hover:text-white transition-colors">About the Project</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-amber-500 font-medium">Disclaimer:</span> This tool is a research prototype for academic purposes only.
            It provides AI-based screening results and does not certify the authenticity of any medicine.
            Results must not be used as a substitute for professional medical or pharmaceutical verification.
            Model performance metrics reflect evaluation on a controlled research dataset, not real-world conditions.
          </p>
          <p className="text-xs text-slate-600 mt-3">
            © {CURRENT_YEAR} Counterfeit Medicine Detector — B.Tech AI & Data Science Research Project.
          </p>
        </div>
      </div>
    </footer>
  );
}
