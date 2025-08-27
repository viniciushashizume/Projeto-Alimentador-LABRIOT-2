// src/App.tsx
import React from 'react';
import FeederDashboard from './components/FeederDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <FeederDashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;