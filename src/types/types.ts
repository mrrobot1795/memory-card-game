export interface Card {
    id: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  
  export interface Emoji {
    name: string;
    category: string;
    group: string;
    htmlCode: string[];  // Note: this is an array of codes
    unicode: string[];
  }
