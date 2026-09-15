import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmpathizeForm } from '@/components/forms/stage-forms/empathize-form';
import { writeDraft, readDraft } from '@/lib/draft-storage';

const DRAFT_KEY = 'pijam-draft-idea-1-Empathize';

describe('<EmpathizeForm /> draft autosave — real localStorage, real DOM', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders empty with no restored-draft banner when there is nothing saved', () => {
    render(<EmpathizeForm onSubmit={vi.fn()} draftKey={DRAFT_KEY} />);

    expect(screen.queryByText(/unsaved work/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/what is the problem/i)).toHaveValue('');
  });

  it('restores a prior draft from localStorage into the form fields on mount, on an unreliable-connection reload', () => {
    writeDraft(DRAFT_KEY, {
      what: 'Classrooms lack natural light',
      when: 'Winter months',
      where: 'Rural schools',
      who: 'Students and teachers',
      how: 'Increases energy costs',
      whys: ['Why 1', 'Why 2', 'Why 3', 'Why 4', 'Why 5'],
      rootCause: 'No solar infrastructure',
    });

    render(<EmpathizeForm onSubmit={vi.fn()} draftKey={DRAFT_KEY} />);

    expect(screen.getByText(/unsaved work from earlier was restored/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what is the problem/i)).toHaveValue('Classrooms lack natural light');
    expect(screen.getByLabelText(/root cause/i)).toHaveValue('No solar infrastructure');
  });

  it('autosaves to localStorage as the student types, debounced', () => {
    vi.useFakeTimers();
    render(<EmpathizeForm onSubmit={vi.fn()} draftKey={DRAFT_KEY} />);

    fireEvent.change(screen.getByLabelText(/what is the problem/i), {
      target: { value: 'Solar lamps are needed' },
    });

    // Not written yet - still inside the debounce window.
    expect(readDraft(DRAFT_KEY)).toBeNull();

    vi.advanceTimersByTime(700);

    expect(readDraft<{ what: string }>(DRAFT_KEY)?.what).toBe('Solar lamps are needed');
  });

  it('clears the draft once the form is actually submitted, so a stale draft never resurfaces after real success', () => {
    writeDraft(DRAFT_KEY, {
      what: 'x',
      when: 'x',
      where: 'x',
      who: 'x',
      how: 'x',
      whys: ['a', 'b', 'c', 'd', 'e'],
      rootCause: 'x',
    });
    const onSubmit = vi.fn();

    render(<EmpathizeForm onSubmit={onSubmit} draftKey={DRAFT_KEY} />);
    fireEvent.click(screen.getByRole('button', { name: /complete empathize stage/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(readDraft(DRAFT_KEY)).toBeNull();
  });

  it('does not submit or clear the draft when required fields are still blank', () => {
    writeDraft(DRAFT_KEY, { what: 'kept' });
    const onSubmit = vi.fn();

    render(<EmpathizeForm onSubmit={onSubmit} draftKey={DRAFT_KEY} />);
    fireEvent.click(screen.getByRole('button', { name: /complete empathize stage/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(readDraft(DRAFT_KEY)).not.toBeNull();
    expect(screen.getByText(/when is missing/i)).toBeInTheDocument();
  });
});
