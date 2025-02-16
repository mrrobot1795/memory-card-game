export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}
export interface Emoji {
  htmlCode: string[];
  [key: string]: unknown;
}
export interface GameStats {
  moves: number;
  elapsedTime: number;
  pairsFound: number;
  totalPairs: number;
}

export interface CardOption {
  value: number;
  label: string;
}

export const CARD_COUNT_OPTIONS: CardOption[] = [
  { value: 10, label: "10 Cards (5 Pairs)" },
  { value: 20, label: "20 Cards (10 Pairs)" },
  { value: 30, label: "30 Cards (15 Pairs)" },
  { value: 40, label: "40 Cards (20 Pairs)" },
  { value: 50, label: "50 Cards (25 Pairs)" },
];
