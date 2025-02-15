import { useState, useEffect, useCallback } from "react";
import { Card, Emoji } from "@/types/types";
import { shuffleArray, decodeHtmlEntity } from "@/utils/gameUtils";

interface GameState {
  cards: Card[];
  flippedCards: Card[];
  isProcessing: boolean;
  moves: number;
  gameStartTime: Date | null;
  elapsedTime: number;
  isGameComplete: boolean;
  isTimeUp: boolean;
}

const selectRandomEmojis = (data: Emoji[], pairsNeeded: number): Emoji[] => {
  const shuffledEmojis = shuffleArray(data);
  return shuffledEmojis.slice(0, pairsNeeded);
};

const createCardPairs = (emojis: Emoji[]): Card[] => {
  const cardPairs = emojis.flatMap((emoji, index) => {
    const decodedEmoji = decodeHtmlEntity(emoji.htmlCode);

    return [
      {
        id: `${index}-a`,
        emoji: decodedEmoji,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${index}-b`,
        emoji: decodedEmoji,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return shuffleArray(cardPairs);
};

export const useGameLogic = (
  category: string,
  pairsNeeded: number,
  timeLimit: number = 0
) => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    isProcessing: false,
    moves: 0,
    gameStartTime: null,
    elapsedTime: 0,
    isGameComplete: false,
    isTimeUp: false,
  });

  // Timer effect
  useEffect(() => {
    if (!gameState.gameStartTime || gameState.isGameComplete) return;

    const timerInterval = setInterval(() => {
      setGameState(prev => {
        const newElapsedTime = Math.floor(
          (new Date().getTime() - prev.gameStartTime!.getTime()) / 1000
        );

        // Check if time is up
        if (timeLimit > 0 && newElapsedTime >= timeLimit) {
          clearInterval(timerInterval);
          return { 
            ...prev, 
            elapsedTime: timeLimit, // Set to timeLimit instead of newElapsedTime
            isTimeUp: true,
            isProcessing: true // Prevent further moves
          };
        }

        return { ...prev, elapsedTime: newElapsedTime };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState.gameStartTime, gameState.isGameComplete, timeLimit]);

  const updateCards = (
    cards: Card[],
    firstCard: Card,
    secondCard: Card,
    isMatch: boolean
  ) => {
    return cards.map((card) =>
      card.id === firstCard.id || card.id === secondCard.id
        ? { ...card, isFlipped: isMatch, isMatched: isMatch }
        : card
    );
  };

  const handleCardClick = useCallback(
    (clickedCard: Card) => {
      if (
        gameState.isProcessing ||
        clickedCard.isFlipped ||
        clickedCard.isMatched ||
        gameState.isTimeUp
      )
        return;

      setGameState((prev) => ({
        ...prev,
        moves: prev.flippedCards.length === 1 ? prev.moves + 1 : prev.moves,
        cards: prev.cards.map((card) =>
          card.id === clickedCard.id ? { ...card, isFlipped: true } : card
        ),
        flippedCards: [...prev.flippedCards, clickedCard],
        gameStartTime: prev.gameStartTime || new Date(),
      }));
    },
    [gameState.isProcessing, gameState.isTimeUp]
  );

  const resetAllCards = (cards: Card[]): Card[] => {
    return cards.map(card => ({ ...card, isFlipped: false }));
  };

  // Process flipped cards with time limit check
  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      const [firstCard, secondCard] = gameState.flippedCards;
      const isMatch = firstCard.emoji === secondCard.emoji;

      setGameState((prev) => ({ ...prev, isProcessing: true }));

      setTimeout(() => {
        setGameState((prev) => {
          if (prev.isTimeUp) {
            return {
              ...prev,
              cards: resetAllCards(prev.cards),
              flippedCards: [],
              isProcessing: false
            };
          }

          return {
            ...prev,
            cards: updateCards(prev.cards, firstCard, secondCard, isMatch),
            flippedCards: [],
            isProcessing: false,
          };
        });
      }, 1000);
    }
  }, [gameState.flippedCards]);

  // Check for game completion considering time limit
  useEffect(() => {
    if (
      gameState.cards.length > 0 &&
      !gameState.isGameComplete &&
      !gameState.isTimeUp
    ) {
      const isComplete = gameState.cards.every((card) => card.isMatched);
      if (isComplete) {
        setGameState((prev) => ({
          ...prev,
          isGameComplete: true,
          isProcessing: true,
        }));
      }
    }
  }, [gameState.cards, gameState.isTimeUp, gameState.isGameComplete]);

  // Initialize game
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch(
          `https://emojihub.yurace.pro/api/all/category/${category}`
        );
        const data: Emoji[] = await response.json();
        const selected = selectRandomEmojis(data, pairsNeeded);
        const cardPairs = createCardPairs(selected);

        setGameState({
          cards: cardPairs,
          flippedCards: [],
          isProcessing: false,
          moves: 0,
          gameStartTime: new Date(),
          elapsedTime: 0,
          isGameComplete: false,
          isTimeUp: false,
        });
      } catch (error) {
        console.error("Error fetching emojis:", error);
      }
    };

    if (category) {
      fetchEmojis();
    }
  }, [category, pairsNeeded]);

  const resetGame = useCallback(() => {
    const resetCards = shuffleArray(
      gameState.cards.map((card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      }))
    );

    setGameState({
      cards: resetCards,
      flippedCards: [],
      isProcessing: false,
      moves: 0,
      gameStartTime: new Date(),
      elapsedTime: 0,
      isGameComplete: false,
      isTimeUp: false,
    });
  }, [gameState.cards]);

  return {
    gameState,
    handleCardClick,
    resetGame,
  };
};
