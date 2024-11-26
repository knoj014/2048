export type Board = number[][];

export type GameStatus = '' | 'You Win!' | 'You Lose!';

export type MoveDirection = {
  dx: number;
  dy: number;
};

export type BlockColor = {
  background: string;
  text: string;
};
