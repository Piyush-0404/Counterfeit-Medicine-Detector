import { describe, expect, it } from 'vitest';
import { fetchAnalysisById } from './mockApi';

describe('mock analysis lookup', () => {
  it('preserves the selected history record identity and metadata', async () => {
    const result = await fetchAnalysisById('CMD-LX7A2-B4KQ');

    expect(result?.id).toBe('CMD-LX7A2-B4KQ');
    expect(result?.imageName).toBe('paracetamol_500mg_front.jpg');
    expect(result?.screeningStatus).toBe('low_risk');
  });

  it('returns null for an unknown history ID', async () => {
    await expect(fetchAnalysisById('CMD-UNKNOWN')).resolves.toBeNull();
  });
});
