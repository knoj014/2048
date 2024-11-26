import './Block.css';

import { BLOCK_COLORS, defaultColor } from './constants';
import type { BlockColor } from './types';

function Block({ num }: { num: number }) {
  const color: BlockColor = BLOCK_COLORS[num] ?? defaultColor;
  const { background, text } = color;

  return (
    <div className="block" style={{ backgroundColor: background, color: text }}>
      {num !== 0 ? num : ''}
    </div>
  );
}

export default Block;
