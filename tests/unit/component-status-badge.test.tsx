import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/shared/status-badge';

describe('<StatusBadge /> — Design Thinking stage rendering across dashboards', () => {
  it.each([
    ['Empathize', 'stage-empathize'],
    ['Define', 'stage-define'],
    ['Ideate', 'stage-ideate'],
    ['Prototype', 'stage-prototype'],
    ['Test', 'stage-test'],
  ] as const)('renders the %s stage with its own token-driven color, not a shared one', (status, tokenClass) => {
    render(<StatusBadge status={status} />);

    const badge = screen.getByText(status);
    expect(badge).toBeInTheDocument();
    // Each stage pulls from its own CSS custom property (bg-stage-x-soft,
    // text-stage-x, border-stage-x-border) rather than a literal hex/
    // Tailwind-palette color, so it stays correct across light/dark and
    // never collides with the brand accent (see DESIGN.md's Separate
    // Channel Rule).
    expect(badge.className).toContain(`text-${tokenClass}`);
  });

  it('never reuses the brand accent color for a stage badge', () => {
    render(<StatusBadge status="Empathize" />);
    const badge = screen.getByText('Empathize');
    expect(badge.className).not.toContain('text-primary');
    expect(badge.className).not.toContain('bg-primary');
  });
});
