import { describe, expect, it } from 'vitest';

import { slideAndMerge } from './useGame';

describe('slideAndMerge', () => {
  it('should merge two identical adjacent numbers', () => {
    const input = [2, 2, 0, 0];
    const expectedLine = [4, 0, 0, 0];
    const expectedScore = 4;

    const result = slideAndMerge(input);

    expect(result.newLine).toEqual(expectedLine);
    expect(result.scoreUpdate).toBe(expectedScore);
  });

  it('should slide non-zero numbers to the left', () => {
    const input = [0, 2, 0, 4];
    const expectedLine = [2, 4, 0, 0];
    const expectedScore = 0;

    const result = slideAndMerge(input);

    expect(result.newLine).toEqual(expectedLine);
    expect(result.scoreUpdate).toBe(expectedScore);
  });

  it('should do nothing when merging is impossible', () => {
    const input = [2, 4, 2, 4];
    const expectedLine = [2, 4, 2, 4];
    const expectedScore = 0;

    const result = slideAndMerge(input);

    expect(result.newLine).toEqual(expectedLine);
    expect(result.scoreUpdate).toBe(expectedScore);
  });

  it('should handle multiple merges in one line, merges once', () => {
    const input = [2, 2, 2, 2];
    const expectedLine = [4, 4, 0, 0];
    const expectedScore = 8;

    const result = slideAndMerge(input);

    expect(result.newLine).toEqual(expectedLine);
    expect(result.scoreUpdate).toBe(expectedScore);
  });
});
