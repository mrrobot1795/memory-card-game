import React from "react";
import { formatTime } from "@/utils/gameUtils";
import "./GameStats.scss";

interface GameStatsProps {
  moves: number;
  elapsedTime: number;
  timeLimit?: number;
  pairsFound: number;
  totalPairs: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  moves,
  elapsedTime,
  timeLimit,
  pairsFound,
  totalPairs,
}) => (
  <div className="game-stats">
    <div className="stat-item">
      <h3>Moves</h3>
      <p>{moves}</p>
    </div>
    <div className="stat-item">
      <h3>Time</h3>
      <p>
        {formatTime(elapsedTime)}
        {timeLimit && timeLimit > 0 && ` / ${formatTime(timeLimit)}`}
      </p>
    </div>
    <div className="stat-item">
      <h3>Pairs</h3>
      <p>
        {pairsFound} / {totalPairs}
      </p>
    </div>
  </div>
);

export default React.memo(GameStats);
