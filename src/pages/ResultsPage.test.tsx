import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ResultsPage } from './ResultsPage';

vi.mock('../services/api', () => ({
  getAnalysisById: async (id: string) => {
    if (id === 'CMD-LX7A2-B4KQ') {
      return {
        id,
        timestamp: '2026-01-01T10:00:00.000Z',
        imageUrl: '',
        imageName: 'paracetamol_500mg_front.jpg',
        imageSize: 100,
        screeningStatus: 'low_risk',
        visualAnalysis: {
          genuineScore: 91,
          counterfeitScore: 9,
          classification: 'genuine',
          confidence: 91,
          modelName: 'ResNet-18 + RBF-SVM',
          embeddingDimensions: 128,
        },
        ocrAnalysis: {
          productName: { value: 'Paracetamol', confidence: 90, detected: true },
          batchNumber: { value: null, confidence: -1, detected: false },
          manufacturingDate: { value: null, confidence: -1, detected: false },
          expiryDate: { value: null, confidence: -1, detected: false },
          overallConfidence: 90,
          medicineKeywords: ['paracetamol'],
          rawText: 'Paracetamol',
        },
        evidence: { visual: [], ocr: [], missing: [], warnings: [] },
        recommendedAction: 'Verify with a pharmacist.',
        processingTimeMs: 200,
        demoMode: true,
      };
    }
    if (id === 'CMD-MN9C3-P7RS') {
      return {
        id,
        timestamp: '2026-01-02T10:00:00.000Z',
        imageUrl: '',
        imageName: 'amoxicillin_250mg_blister.png',
        imageSize: 100,
        screeningStatus: 'elevated_risk',
        visualAnalysis: {
          genuineScore: 13,
          counterfeitScore: 87,
          classification: 'counterfeit',
          confidence: 87,
          modelName: 'ResNet-18 + RBF-SVM',
          embeddingDimensions: 128,
        },
        ocrAnalysis: {
          productName: { value: 'Amoxicillin', confidence: 80, detected: true },
          batchNumber: { value: null, confidence: -1, detected: false },
          manufacturingDate: { value: null, confidence: -1, detected: false },
          expiryDate: { value: null, confidence: -1, detected: false },
          overallConfidence: 80,
          medicineKeywords: ['amoxicillin'],
          rawText: 'Amoxicillin',
        },
        evidence: { visual: [], ocr: [], missing: [], warnings: [] },
        recommendedAction: 'Verify with a pharmacist.',
        processingTimeMs: 200,
        demoMode: true,
      };
    }
    return null;
  },
}));
function renderReport(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/dashboard/history/view/${id}`]}>
      <Routes>
        <Route path="/dashboard/history/view/:id" element={<ResultsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ResultsPage history reports', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('loads the exact selected history report', async () => {
    renderReport('CMD-LX7A2-B4KQ');

    expect(await screen.findByText(/File: paracetamol_500mg_front\.jpg/)).toBeInTheDocument();
    expect(screen.getByText('Low Screening Risk')).toBeInTheDocument();
  });

  it('loads a different report for a different ID', async () => {
    renderReport('CMD-MN9C3-P7RS');

    expect(await screen.findByText(/File: amoxicillin_250mg_blister\.png/)).toBeInTheDocument();
    expect(screen.getByText('Elevated Screening Risk')).toBeInTheDocument();
    expect(screen.queryByText('paracetamol_500mg_front.jpg')).not.toBeInTheDocument();
  });

  it('shows a not-found state for an invalid ID', async () => {
    renderReport('CMD-UNKNOWN');

    await waitFor(() => {
      expect(screen.getByText('Report Not Found')).toBeInTheDocument();
    });
    expect(screen.getByText('Back to Analysis History')).toBeInTheDocument();
  });
});
