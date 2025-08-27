// src/components/FeederDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getLatestFeederData, FeederData } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import './FeederDashboard.css';

// Importe os ícones
import sunIcon from '../assets/sun-icon.png'; // Caminho para o ícone do sol
import moonIcon from '../assets/moon-icon.png'; // Caminho para o ícone da lua

const FeederDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [feederData, setFeederData] = useState<FeederData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await getLatestFeederData();
      setFeederData(data);
    } catch (err) {
      setError("Falha ao carregar dados. Verifique se a API está no ar.");
      setFeederData({ distance: 0, tempo: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getLevelMessage = (percentage: number) => {
    if (percentage > 75) return "Nível de Ração: Alto";
    if (percentage > 40) return "Nível de Ração: Médio";
    if (percentage > 15) return "Nível de Ração: Baixo";
    return "Nível de Ração: Crítico! Reabasteça.";
  };

  if (loading) {
    return <div className="dashboard-container"><h1>Carregando...</h1></div>;
  }
  
  const percentage = feederData ? Math.round(feederData.distance) : 0;
  const lastUpdate = feederData ? new Date(feederData.tempo).toLocaleString('pt-BR') : 'N/A';

  const dashboardClassName = `dashboard-container ${theme}`;

  return (
    <div className={dashboardClassName}>
      <button onClick={toggleTheme} className="theme-toggle-button">
        {/* Renderiza o ícone apropriado com base no tema atual */}
        <img 
          src={theme === 'light' ? moonIcon : sunIcon} 
          alt={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'} 
          className="theme-icon"
        />
      </button>
      
      {error && <div className="error-message">{error}</div>}
      <h1 className="dashboard-title">Dashboard do Alimentador</h1>
      <div className="gauge-container">
        <div className="gauge-body">
          <div className="gauge-fill" style={{ height: `${percentage}%` }}></div>
          <div className="gauge-cover">{percentage}%</div>
        </div>
      </div>
      <div className="dashboard-info">
        <h2>{getLevelMessage(percentage)}</h2>
        <p>Última atualização: {lastUpdate}</p>
      </div>
    </div>
  );
};

export default FeederDashboard;