import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('application routes', () => {
  it('loads the landing page', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Screen Medicines/ })).toBeInTheDocument();
  });

  it('loads the dashboard analysis route', async () => {
    window.history.pushState({}, '', '/dashboard/analyze');
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'New Analysis' })).toBeInTheDocument();
  });
});
