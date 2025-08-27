// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FeederDashboard from './components/FeederDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard'; // Corrigido
import Sidebar from './components/Sidebar'; // Corrigido
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route path="/" element={<FeederDashboard />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;