import type { BlockColor, MoveDirection } from './types';

export const BLOCK_COLORS: { [key: number]: BlockColor } = {
  2: { background: '#eee4da', text: '#776e65' },
  4: { background: '#eee1c9', text: '#776e65' },
  8: { background: '#f3b27a', text: '#f9f6f2' },
  16: { background: '#f69664', text: '#f9f6f2' },
  32: { background: '#f77c5f', text: '#f9f6f2' },
  64: { background: '#f75f3b', text: '#f9f6f2' },
  128: { background: '#edd073', text: '#f9f6f2' },
};

export const defaultColor = { background: '#cdc1b4', text: '#776e65' };

export const INITIAL_BOARD: number[][] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export const WIN_SCORE = 128;

export const moveDirection: { [key: string]: MoveDirection } = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
};
