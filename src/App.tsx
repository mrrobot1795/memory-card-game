// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage.tsx';
import GamePage from './pages/GamePage.tsx';
import './styles/global.scss';

const AppHeader: React.FC = () => (
  <header className="app-header">
    <h1>Memory Card Game</h1>
  </header>
);

const AppFooter: React.FC = () => (
  <footer className="app-footer">
    <p>&copy; {new Date().getFullYear()} Memory Card Game. All rights reserved.</p>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <AppHeader />
        <main className="content">
          <Routes>
            <Route path="/" element={
              <div className="page-transition">
                <StartPage />
              </div>
            } />
            <Route path="/game/:category" element={
              <div className="page-transition">
                <GamePage />
              </div>
            } />
            {/* Catch invalid routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
};

export default App;
