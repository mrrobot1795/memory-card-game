import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Board from '@/components/Board/Board';
import { GameStats } from '@/components/GameStats/GameStats';
import { VictoryOverlay } from '@/components/VictoryOverlay/VictoryOverlay';
import { LossOverlay } from '@/components/LossOverlay/LossOverlay';
import { useGameLogic } from '@/hooks/useGameLogic';
import '@/styles/GamePage.scss';

const GamePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const cardCount = parseInt(searchParams.get('cards') ?? '10', 10);
  const timeLimit = parseInt(searchParams.get('time') ?? '0', 10);
  const pairsNeeded = cardCount / 2;

  const {
    gameState,
    handleCardClick,
    resetGame
  } = useGameLogic(category ?? '', pairsNeeded, timeLimit);

  const startNewGame = () => navigate('/');

  const showLossOverlay = timeLimit > 0 && gameState.isTimeUp;

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Memory Game - {category}</h1>
        <GameStats
          moves={gameState.moves}
          elapsedTime={gameState.elapsedTime}
          timeLimit={timeLimit}
          pairsFound={gameState.cards.filter(card => card.isMatched).length / 2}
          totalPairs={pairsNeeded}
        />
      </div>

      <Board cards={gameState.cards} onCardClick={handleCardClick} />
      
      <div className="game-controls">
        <button className="restart-btn" onClick={resetGame}>
          Restart Game
        </button>
        <button className="new-game-btn" onClick={startNewGame}>
          New Game
        </button>
      </div>

      {gameState.isGameComplete && (
        <VictoryOverlay
          elapsedTime={gameState.elapsedTime}
          moves={gameState.moves}
          onPlayAgain={startNewGame}
        />
      )}

      {showLossOverlay && (
        <LossOverlay
          timeLimit={timeLimit}
          elapsedTime={gameState.elapsedTime}
          moves={gameState.moves}
          onPlayAgain={resetGame}
          onNewGame={startNewGame}
        />
      )}
    </div>
  );
};

export default GamePage;
