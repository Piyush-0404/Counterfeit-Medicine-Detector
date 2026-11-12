import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="analyze" element={<AnalysisPage />} />
        <Route path="result" element={<ResultsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/view/:id" element={<ResultsPage />} />
        <Route path="performance" element={<ModelPerformancePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="/about-project" element={
            <DashboardLayout>
              <AboutProjectPage />
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
