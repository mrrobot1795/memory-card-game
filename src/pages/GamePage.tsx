import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Board from '../components/Board.tsx';
import { Card, Emoji } from '../types';
import '../styles/GamePage.scss';

// Helper: Decode HTML entities (like "&#128512;") to an emoji character
function decodeHtmlEntity(entity: string): string {
  const match = entity.match(/&#(\d+);/);
  if (match) {
    const code = parseInt(match[1], 10);
    return String.fromCodePoint(code);
  }
  return entity;
}

// Helper: Shuffle an array (Fisher-Yates)
const shuffleArray = (array: any[]): any[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const GamePage: React.FC = () => {
  // Retrieve the selected category from URL parameters
  const { category } = useParams<{ category: string }>();
  
  // Retrieve the card count from the query string
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cardCountParam = searchParams.get('cards');
  const cardCount = cardCountParam ? parseInt(cardCountParam, 10) : 10;
  const pairsNeeded = cardCount / 2;

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const [moves, setMoves] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        // Fetch emojis for the selected category
        const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${category}`);
        const data: Emoji[] = await response.json();
        console.log(`Fetched emojis for category ${category}:`, data);

        // Randomly select the required number of unique emojis (for pairsNeeded)
        const selected: Emoji[] = [];
        const filtered = [...data];
        while (selected.length < pairsNeeded && filtered.length > 0) {
          const randomIndex = Math.floor(Math.random() * filtered.length);
          selected.push(filtered[randomIndex]);
          filtered.splice(randomIndex, 1);
        }

        // Create card pairs from the selected emojis
        let cardPairs: Card[] = [];
        selected.forEach((emoji, index) => {
          if (emoji.htmlCode && emoji.htmlCode.length > 0) {
            const emojiChar = decodeHtmlEntity(emoji.htmlCode[0]);
            const card1: Card = { id: index * 2, emoji: emojiChar, isFlipped: false, isMatched: false };
            const card2: Card = { id: index * 2 + 1, emoji: emojiChar, isFlipped: false, isMatched: false };
            cardPairs.push(card1, card2);
          }
        });

        // Shuffle the cards before setting them in state
        cardPairs = shuffleArray(cardPairs);
        setCards(cardPairs);
      } catch (error) {
        console.error("Error fetching emojis:", error);
      }
    };

    fetchEmojis();
  }, [category, pairsNeeded]);

  // Start timer when game begins
  useEffect(() => {
    if (cards.length > 0 && !gameStartTime) {
      setGameStartTime(new Date());
    }
  }, [cards, gameStartTime]);

  // Update timer
  useEffect(() => {
    if (gameStartTime && !isGameComplete) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStartTime, isGameComplete]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameComplete(true);
    }
  }, [cards]);

  // Check for matching cards when exactly 2 cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [first, second] = flippedCards;
      if (first.emoji === second.emoji) {
        // It's a match—mark them as matched
        setCards(prevCards =>
          prevCards.map(card =>
            card.emoji === first.emoji ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
        setIsProcessing(false);
      } else {
        // Not a match—flip them back after a short delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first.id || card.id === second.id ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handleCardClick = (card: Card) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;
    
    setMoves(prev => prev + 1);
    // Flip the clicked card
    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    setFlippedCards(prev => [...prev, { ...card, isFlipped: true }]);
  };

  const resetGame = () => {
    setMoves(0);
    setGameStartTime(null);
    setElapsedTime(0);
    setIsGameComplete(false);
    setCards([]);
    setFlippedCards([]);
    window.location.reload();
  };

  const startNewGame = () => {
    navigate('/');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Memory Game - {category}</h1>
        <div className="game-stats">
          <div className="stat-item">
            <h3>Moves</h3>
            <p>{moves}</p>
          </div>
          <div className="stat-item">
            <h3>Time</h3>
            <p>{formatTime(elapsedTime)}</p>
          </div>
          <div className="stat-item">
            <h3>Pairs Found</h3>
            <p>{cards.filter(card => card.isMatched).length / 2} / {pairsNeeded}</p>
          </div>
        </div>
      </div>

      <Board cards={cards} onCardClick={handleCardClick} />
      
      <div className="game-controls">
        <button className="restart-btn" onClick={resetGame}>Restart Game</button>
        <button className="new-game-btn" onClick={startNewGame}>New Game</button>
      </div>

      {isGameComplete && (
        <div className="victory-overlay">
          <div className="victory-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed the game in:</p>
            <p>Time: {formatTime(elapsedTime)}</p>
            <p>Moves: {moves}</p>
            <button className="new-game-btn" onClick={startNewGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
