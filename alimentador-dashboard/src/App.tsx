// src/App.tsx
import React from 'react';
import FeederDashboard from './components/FeederDashboard';
import './App.css'; // Pode manter ou remover, dependendo se quer usar estilos globais

function App() {
  return (
    <div className="App">
      <FeederDashboard />
    </div>
  );
}

export default App;