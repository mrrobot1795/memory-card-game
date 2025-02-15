import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { CategorySelector } from '@/components/CategorySelector/CategorySelector';
import { CardCountSelector } from '@/components/CardCountSelector/CardCountSelector';
import { TimerSelector, TIME_OPTIONS } from '@/components/TimerSelector/TimerSelector';
import { useEmojis } from '@/hooks/useEmojis';
import { CARD_COUNT_OPTIONS } from '@/types/game';
import '@/styles/StartPage.scss';

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useEmojis();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCardCount, setSelectedCardCount] = useState<number>(CARD_COUNT_OPTIONS[0].value);
  const [selectedTime, setSelectedTime] = useState<number>(TIME_OPTIONS[0].value);

  const handleStartGame = () => {
    if (selectedCategory) {
      navigate(
        `/game/${encodeURIComponent(selectedCategory)}?cards=${selectedCardCount}&time=${selectedTime}`
      );
    }
  };

  if (loading) {
    return (
      <div className="start-page">
        <LoadingSpinner message="Loading categories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="start-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="start-page">
      <h1 className="title">Let's test how good your memory is?</h1>
      
      <div className="selection-container">
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />

        <CardCountSelector
          options={CARD_COUNT_OPTIONS}
          selectedCount={selectedCardCount}
          onChange={setSelectedCardCount}
        />

        <TimerSelector
          selectedTime={selectedTime}
          onChange={setSelectedTime}
        />
      </div>

      <button
        className="start-button"
        onClick={handleStartGame}
        disabled={!selectedCategory}
      >
        Start Game
      </button>
    </div>
  );
};

export default StartPage;
