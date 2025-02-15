import React from "react";
import { formatTime } from "@/utils/gameUtils";
import "./VictoryOverlay.scss";

interface VictoryOverlayProps {
  elapsedTime: number;
  moves: number;
  onPlayAgain: () => void;
}
export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  elapsedTime,
  moves,
  onPlayAgain,
}) => (
  <div className="victory-overlay">
    {" "}
    <div className="victory-content">
      {" "}
      <h2>🎉 Congratulations! 🎉</h2> <p>You completed the game in:</p>{" "}
      <p>Time: {formatTime(elapsedTime)}</p> <p>Moves: {moves}</p>{" "}
      <button className="new-game-btn" onClick={onPlayAgain}>
        {" "}
        Play Again{" "}
      </button>{" "}
    </div>{" "}
  </div>
);
