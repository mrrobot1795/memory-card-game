import React, { useEffect, useState } from "react";
import CardComponent from "../Card/Card.tsx";
import { Card } from "@/types/types.ts";
import "./Board.scss";

interface BoardProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
}

const Board: React.FC<BoardProps> = ({ cards, onCardClick }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className={`board ${isAnimated ? "animated" : ""}`}>
      {cards.map((card, index) => (
        <CardComponent
          key={card.id}
          card={card}
          onClick={() => onCardClick(card)}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Board;
