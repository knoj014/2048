import { type Key, useCallback, useEffect } from 'react';

import styles from './App.module.css';
import Block from './Block';
import { moveDirection } from './constants';
import ScoreBox from './ScoreBox';
import { useGame } from './useGame';

function App() {
  const { board, score, bestScore, gameStatus, newGame, moveBoard } = useGame();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameStatus !== '') return;
      const direction = moveDirection[e.key];
      if (direction !== undefined) moveBoard(direction);
    },
    [gameStatus, moveBoard],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (board.flat().every((cell) => cell === 0)) {
      newGame();
    }
  }, [board, newGame]);

  return (
    <>
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <h1> 2048 </h1>
          <div className={styles.scoreContainer}>
            <ScoreBox title="SCORE" score={score} />
            <ScoreBox title="BEST" score={bestScore} />
          </div>
        </div>
        <div className={styles.gameControl}>
          <button className={styles.buttonNewGame} onClick={newGame}>
            New Game
          </button>
        </div>
        <div className={styles.gameBoard}>
          {board.flat().map((num: number, idx: Key | null | undefined) => (
            <Block num={num} key={idx} />
          ))}
          {gameStatus !== '' && <div className={styles.gameOverlay}></div>}
          {gameStatus !== '' && (
            <div className={styles.gameMessage}>
              <h2>{gameStatus}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
