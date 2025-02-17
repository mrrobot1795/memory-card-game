import React from "react";
import { Card as CardType } from "@/types/types";
import "./Card.scss";

interface CardProps {
  card: CardType;
  onClick: () => void;
  style?: React.CSSProperties;
}

const CardComponent: React.FC<CardProps> = ({ card, onClick, style }) => {
  const cardClasses = [
    "card",
    card.isFlipped ? "flipped" : "",
    card.isMatched ? "matched" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={cardClasses}
      onClick={onClick}
      style={style}
      type="button"
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className="card-back">{card.emoji}</div>
      </div>
    </button>
  );
};

export default CardComponent;
