import React from "react";
import { formatTime } from "@/utils/gameUtils";
import "./LossOverlay.scss";

interface LossOverlayProps {
  timeLimit: number;
  elapsedTime: number;
  moves: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const LossOverlay: React.FC<LossOverlayProps> = ({
  timeLimit,
  elapsedTime,
  moves,
  onPlayAgain,
  onNewGame,
}) => (
  <div className="loss-overlay">
    <div className="loss-content">
      <h2>Time's Up!</h2>
      <p>You didn't complete the game within {formatTime(timeLimit)}</p>
      <div className="stats">
        <div className="stat-item">
          <span>Time Taken:</span>
          <span>{formatTime(elapsedTime)}</span>
        </div>
        <div className="stat-item">
          <span>Moves Made:</span>
          <span>{moves}</span>
        </div>
      </div>
      <div className="buttons">
        <button className="try-again-btn" onClick={onPlayAgain}>
          Try Again
        </button>
        <button className="new-game-btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  </div>
);
