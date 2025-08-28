// src/components/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import './AnalyticsDashboard.css';

// Importe as imagens de análise da pasta de assets
import dbscanImage from '../assets/leituraDBSCAN.png';
import torchImage from '../assets/leiturasTorch.png';

type AnalysisType = 'dbscan' | 'torch';

const AnalyticsDashboard: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('dbscan');

  const renderImage = () => {
    switch (selectedAnalysis) {
      case 'dbscan':
        return <img src={dbscanImage} alt="Análise DBSCAN" className="analysis-image" />;
      case 'torch':
        return <img src={torchImage} alt="Análise Torch" className="analysis-image" />;
      default:
        return <p>Selecione uma análise para visualizar.</p>;
    }
  };

  return (
    <div className="analytics-container">
      <h1>Análise dos Alimentadores</h1>
      <div className="analysis-menu">
        <button
          className={selectedAnalysis === 'dbscan' ? 'active' : ''}
          onClick={() => setSelectedAnalysis('dbscan')}
        >
          Análise DBSCAN
        </button>
        <button
          className={selectedAnalysis === 'torch' ? 'active' : ''}
          onClick={() => setSelectedAnalysis('torch')}
        >
          Análise Torch
        </button>
      </div>
      <div className="analysis-content">
        {renderImage()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;