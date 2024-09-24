import './App.css';
import { useEffect, useState, type Key } from 'react';
import Block from './Block';
import ScoreBox from './ScoreBox';

function App() {
  const initialBoard: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const [board, setBoard] = useState(() => {
    const savedBoard = localStorage.getItem('board');
    return savedBoard ? JSON.parse(savedBoard) : initialBoard;
  });

  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore ? parseInt(savedScore) : 0;
  });

  const [bestScore, setBestScore] = useState(() => {
    const savedBestScore = localStorage.getItem('bestScore');
    return savedBestScore ? parseInt(savedBestScore) : 0;
  });

  const [gameStatus, setGameStatus] = useState(() => {
    return localStorage.getItem('gameStatus') || '';
  });

  function newGame() {
    const newBoard = initialBoard.map((row) => [...row]);
    addNewBlock(newBoard, 2);
    setBoard(newBoard);
    setScore(0);
    setGameStatus('');
  }

  useEffect(() => {
    if (board.every((row: number[]) => row.every((cell: number) => cell === 0)))
      newGame();
  }, []);

  useEffect(() => {
    checkGameStatus();
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('score', score.toString());
    localStorage.setItem('gameStatus', gameStatus);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score.toString());
    }
  }, [board, score, gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, gameStatus]);

  function handleKeyDown(e: { key: any }) {
    if (gameStatus) return;
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
  }

  function checkGameStatus() {
    if (board.flat().includes(128)) setGameStatus('You Win!');
    else {
      const hasEmptyCells = board.flat().some((cell: number) => cell === 0);
      if (!hasEmptyCells) setGameStatus('You Lose!');
    }
  }

  function moveBoard(dx: number, dy: number) {
    let newBoard = board.map((row: number[]) => [...row]);
    let moved = false;
    let newScore = score;

    const slideAndMerge = (line: number[]) => {
      let newLine = line.filter((num: number) => num !== 0);
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
        let row = [...(newBoard[i] ?? [])];
        if (dx === 1) row.reverse();
        let { newLine: newRow, scoreUpdate } = slideAndMerge(row);
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
        let column: number[] = [];
        for (let i = 0; i < 4; i++) column.push(newBoard[i]?.[j] ?? 0);
        if (dy === 1) column.reverse();
        let { newLine: newColumn, scoreUpdate } = slideAndMerge(column);
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
  }

  function addNewBlock(board: number[][], num?: number) {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((board[i] as (number | undefined)[])[j] === 0)
          emptyCells.push({ x: i, y: j });
      }
    }
    if (emptyCells.length > 0) {
      let { x = 0, y = 0 } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)] || {};
      (board[x] as (number | undefined)[])[y] =
        num ?? (Math.random() < 0.9 ? 2 : 4);
    }
  }

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
          {gameStatus && <div className="game-overlay"></div>}
          {gameStatus && (
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
