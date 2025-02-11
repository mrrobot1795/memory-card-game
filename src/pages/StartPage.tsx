import React, { useEffect, useState } from 'react';
import { Emoji } from '../types';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.scss';

const StartPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCardCount, setSelectedCardCount] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        // Fetch all emojis from the API
        const response = await fetch('https://emojihub.yurace.pro/api/all');
        const data: Emoji[] = await response.json();

        // Extract unique categories (using the 'category' property)
        const uniqueCategories = Array.from(new Set(data.map(emoji => emoji.category)));
        setCategories(uniqueCategories);

        // Set default selection to the first category (if available)
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching emojis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmojis();
  }, []);

  const handleStartGame = () => {
    if (selectedCategory) {
      // Navigate to the game page passing the category in the path
      // and the selected card count as a query parameter.
      navigate(`/game/${encodeURIComponent(selectedCategory)}?cards=${selectedCardCount}`);
    }
  };

  if (loading) {
    return (
      <div className="start-page">
        <div className="loading">
          <div className="spinner" />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="start-page">
      <h1 className="title">Memory Game</h1>
      
      <div className="selection-container">
        <h2>Choose an Emoji Category</h2>
        <div className="select-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <h2>Choose Number of Cards</h2>
        <div className="select-wrapper">
          <select
            value={selectedCardCount}
            onChange={(e) => setSelectedCardCount(parseInt(e.target.value, 10))}
          >
            <option value={10}>10 Cards (5 Pairs)</option>
            <option value={20}>20 Cards (10 Pairs)</option>
            <option value={30}>30 Cards (15 Pairs)</option>
            <option value={40}>40 Cards (20 Pairs)</option>
            <option value={50}>50 Cards (25 Pairs)</option>
          </select>
        </div>
      </div>

      <button
        className="start-button"
        onClick={handleStartGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default StartPage;
