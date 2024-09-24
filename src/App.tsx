import './App.css';

import { type Key, useCallback, useEffect, useMemo, useState } from 'react';

import Block from './Block';
import ScoreBox from './ScoreBox';

function App() {
  const initialBoard = useMemo(
    () => [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [],
  );

  const [board, setBoard] = useState<number[][]>(() => {
    const savedBoard = localStorage.getItem('board');
    if (savedBoard !== null && savedBoard !== '') {
      return JSON.parse(savedBoard) as number[][];
    }
    return initialBoard;
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore !== null ? parseInt(savedScore) : 0;
  });

  const [bestScore, setBestScore] = useState(() => {
    const savedBestScore = localStorage.getItem('bestScore');
    return savedBestScore !== null && savedBestScore.trim() !== ''
      ? parseInt(savedBestScore)
      : 0;
  });

  const [gameStatus, setGameStatus] = useState<string>(() => {
    const savedStatus = localStorage.getItem('gameStatus');
    return savedStatus !== null && savedStatus.trim() !== '' ? savedStatus : '';
  });

  const addNewBlock = useCallback(
    (currentBoard: number[][], num?: number): void => {
      const emptyCells: { x: number; y: number }[] = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if ((currentBoard[i] as number[])[j] === 0) {
            emptyCells.push({ x: i, y: j });
          }
        }
      }
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell =
          emptyCells.length > 0 ? emptyCells[randomIndex] : null;

        if (randomCell !== null) {
          const { x, y } = randomCell as { x: number; y: number };
          if ((currentBoard[x] as number[])[y] !== undefined) {
            (currentBoard[x] as number[])[y] =
              num ?? (Math.random() < 0.9 ? 2 : 4);
          }
        }
      }
    },
    [],
  );

  const newGame = useCallback(() => {
    const newBoard = Array.isArray(initialBoard)
      ? initialBoard.map((row) => [...row])
      : [];
    addNewBlock(newBoard, 2);
    setBoard(newBoard);
    setScore(0);
    setGameStatus('');
  }, [addNewBlock, initialBoard]);

  useEffect(() => {
    if (
      board.every((row: number[]) => row.every((cell: number) => cell === 0))
    ) {
      newGame();
    }
  }, [board, newGame]);

  const checkGameStatus = useCallback(() => {
    if (board.flat().includes(128)) setGameStatus('You Win!');
    else {
      const hasEmptyCells = board.flat().some((cell: number) => cell === 0);
      if (!hasEmptyCells) setGameStatus('You Lose!');
    }
  }, [board]);

  useEffect(() => {
    checkGameStatus();
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('score', score.toString());
    localStorage.setItem('gameStatus', gameStatus);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score.toString());
    }
  }, [board, score, gameStatus, checkGameStatus, bestScore]);

  const moveBoard = useCallback(
    (dx: number, dy: number) => {
      const newBoard = board.map((row: number[]) => [...row]);
      let moved = false;
      let newScore = score;

      const slideAndMerge = (line: number[]) => {
        const newLine = line.filter((num: number) => num !== 0);
        let scoreUpdate = 0;
        for (let i = 0; i < newLine.length - 1; i++) {
          if (newLine[i] === newLine[i + 1]) {
            const newNum = (newLine[i] as number) * 2;
            scoreUpdate += newNum;
            newLine[i] = newNum;
            newLine.splice(i + 1, 1);
          }
        }
        while (newLine.length < 4) newLine.push(0);
        return { newLine, scoreUpdate };
      };

      if (dx !== 0) {
        for (let i = 0; i < 4; i++) {
          const row = [...(newBoard[i] ?? [])];
          if (dx === 1) row.reverse();
          const { newLine: newRow, scoreUpdate } = slideAndMerge(row);
          if (dx === 1) {
            row.reverse();
            newRow.reverse();
          }
          if (scoreUpdate !== 0) newScore += scoreUpdate;
          if (newRow.join() !== row.join()) moved = true;
          newBoard[i] = newRow;
        }
      }

      if (dy !== 0) {
        for (let j = 0; j < 4; j++) {
          const column: number[] = [];
          for (let i = 0; i < 4; i++) column.push(newBoard[i]?.[j] ?? 0);
          if (dy === 1) column.reverse();
          const { newLine: newColumn, scoreUpdate } = slideAndMerge(column);
          if (dy === 1) {
            column.reverse();
            newColumn.reverse();
          }
          if (scoreUpdate !== 0) newScore += scoreUpdate;
          if (newColumn.join() !== column.join()) moved = true;
          for (let i = 0; i < 4; i++)
            (newBoard[i] as (number | undefined)[])[j] = newColumn[i];
        }
      }

      if (moved) {
        addNewBlock(newBoard);
        setBoard(newBoard);
        setScore(newScore);
        checkGameStatus();
      }
    },
    [board, score, addNewBlock, setBoard, setScore, checkGameStatus],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameStatus !== '') return;
      switch (e.key) {
        case 'ArrowUp':
          moveBoard(0, -1);
          break;
        case 'ArrowDown':
          moveBoard(0, 1);
          break;
        case 'ArrowLeft':
          moveBoard(-1, 0);
          break;
        case 'ArrowRight':
          moveBoard(1, 0);
          break;
        default:
          break;
      }
    },
    [gameStatus, moveBoard],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className="game-container">
        <div className="game-header">
          <h1> 2048 </h1>
          <div className="score-container">
            <ScoreBox title="SCORE" score={score} />
            <ScoreBox title="BEST" score={bestScore} />
          </div>
        </div>
        <div className="game-control">
          <button className="button-newGame" onClick={newGame}>
            New Game
          </button>
        </div>
        <div className="game-board">
          {board.flat().map((num: number, idx: Key | null | undefined) => (
            <Block num={num} key={idx} />
          ))}
          {gameStatus !== '' && <div className="game-overlay"></div>}
          {gameStatus !== '' && (
            <div className="game-message">
              <h2>{gameStatus}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
