/**
 * API service layer — ready for FastAPI backend integration.
 * Currently delegates to mockApi. When backend is available,
 * replace the mock calls below with real fetch/axios calls.
 *
 * Base URL: set VITE_API_BASE_URL in .env
 * e.g., VITE_API_BASE_URL=http://localhost:8000
 */

import type { AnalysisResult, DashboardStats, HistoryRecord, ModelMetrics, ProcessingStage } from '../types';
import {
  fetchDashboardStats as mockDashboardStats,
  fetchHistory as mockFetchHistory,
  fetchAnalysisById as mockFetchById,
  fetchModelMetrics as mockFetchMetrics,
  runMockAnalysis,
} from './mockApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = !API_BASE;

export async function analyzeImage(
  file: File,
  onStageUpdate: (stages: ProcessingStage[]) => void,
): Promise<AnalysisResult> {
  const imageUrl = URL.createObjectURL(file);

  if (USE_MOCK) {
    return runMockAnalysis(imageUrl, file.name, file.size, onStageUpdate);
  }

  // Real API integration:
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`);
  return res.json();
}

export async function getHistory(): Promise<HistoryRecord[]> {
  if (USE_MOCK) return mockFetchHistory();
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

export async function getAnalysisById(id: string): Promise<AnalysisResult | null> {
  if (USE_MOCK) return mockFetchById(id);
  const res = await fetch(`${API_BASE}/api/history/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  if (USE_MOCK) return mockFetchMetrics();
  const res = await fetch(`${API_BASE}/api/model/metrics`);
  if (!res.ok) throw new Error('Failed to load metrics');
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) return mockDashboardStats();
  const res = await fetch(`${API_BASE}/api/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard stats');
  return res.json();
}
