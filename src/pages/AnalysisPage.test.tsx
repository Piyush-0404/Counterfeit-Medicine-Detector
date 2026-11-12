import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AnalysisPage } from './AnalysisPage';
import { ToastProvider } from '../components/common/Toast';

const analyzeImageMock = vi.fn();

vi.mock('../services/api', () => ({
  analyzeImage: (...args: unknown[]) => analyzeImageMock(...args),
}));

function renderAnalysis() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <AnalysisPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

function makeFile(name: string, type: string) {
  return new File(['image-data'], name, { type });
}

describe('AnalysisPage upload workflow', () => {
  it.each([
    ['photo.jpg', 'image/jpeg'],
    ['photo.png', 'image/png'],
    ['photo.webp', 'image/webp'],
  ])('accepts a valid %s file', (name, type) => {
    renderAnalysis();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile(name, type)] },
    });

    expect(screen.getByAltText('Medicine packaging preview')).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze Medicine' })).toBeEnabled();
  });

  it('rejects unsupported file types', () => {
    renderAnalysis();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile('notes.pdf', 'application/pdf')] },
    });

    expect(screen.getAllByText(/Unsupported file type/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Analyze Medicine' })).toBeDisabled();
  });

  it('supports removing and replacing the selected image', () => {
    renderAnalysis();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile('first.jpg', 'image/jpeg')] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Remove image' }));
    expect(screen.queryByAltText('Medicine packaging preview')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile('replacement.png', 'image/png')] },
    });
    expect(screen.getByText(/replacement\.png/)).toBeInTheDocument();
  });

  it('shows loading and navigates after a successful analysis', async () => {
    analyzeImageMock.mockImplementation(async (_file, onStageUpdate) => {
      onStageUpdate([]);
      return {
        id: 'CMD-NEW',
        timestamp: new Date().toISOString(),
        imageUrl: '',
        imageName: 'photo.jpg',
        imageSize: 10,
        screeningStatus: 'low_risk',
        visualAnalysis: {
          genuineScore: 90,
          counterfeitScore: 10,
          classification: 'genuine',
          confidence: 90,
          modelName: 'RBF-SVM',
          embeddingDimensions: 128,
        },
        ocrAnalysis: {
          productName: { value: 'Demo', confidence: 90, detected: true },
          batchNumber: { value: null, confidence: -1, detected: false },
          manufacturingDate: { value: null, confidence: -1, detected: false },
          expiryDate: { value: null, confidence: -1, detected: false },
          overallConfidence: 90,
          medicineKeywords: [],
          rawText: '',
        },
        evidence: { visual: [], ocr: [], missing: [], warnings: [] },
        recommendedAction: 'Verify with a pharmacist.',
        processingTimeMs: 100,
        demoMode: true,
      };
    });
    renderAnalysis();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile('photo.jpg', 'image/jpeg')] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze Medicine' }));

    expect(await screen.findByText('Analyzing...')).toBeInTheDocument();
    await waitFor(() => expect(analyzeImageMock).toHaveBeenCalledOnce());
    expect(sessionStorage.getItem('lastAnalysisResult')).toContain('CMD-NEW');
  });

  it('shows API errors without crashing', async () => {
    analyzeImageMock.mockRejectedValueOnce(new Error('Service unavailable'));
    renderAnalysis();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [makeFile('photo.jpg', 'image/jpeg')] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Analyze Medicine' }));

    expect((await screen.findAllByText('Service unavailable')).length).toBeGreaterThan(0);
  });
});
