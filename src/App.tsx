import './App.css';
import { useState } from 'react';
import Block from './Block';
import ScoreBox from './ScoreBox';

function App() {
  //To confirm that the color change according to the number
  //Real project wouldn't be like this
  const initialBoard = [
    [0, 2, 4, 8],
    [16, 32, 64, 128],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  const [board, setBoard] = useState(initialBoard);

  const [score, setScore] = useState(0);

  const newGame = () => {
    setBoard(initialBoard);
    setScore(0);
  }

  return (
    <>
      <div className='game-container'>
        <div className='game-header'>
          <h1> 2048 </h1>
          <ScoreBox title='SCORE' score={score} />
        </div>
        <div className='game-control'>
          <button className='button-newGame' onClick={newGame}>New Game</button>
        </div>
        <div className='game-board'>
          {board.flat().map((num, idx) => (
            <Block num={num} key={idx} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
