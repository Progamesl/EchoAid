import { __getSpinnerSizeClass } from '../LoadingSpinner';

describe('LoadingSpinner size classes', () => {
  it('returns correct classes for sizes', () => {
    expect(__getSpinnerSizeClass('sm')).toBe('w-4 h-4');
    expect(__getSpinnerSizeClass('md')).toBe('w-6 h-6');
    expect(__getSpinnerSizeClass('lg')).toBe('w-8 h-8');
  });
});
