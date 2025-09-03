// src/components/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import './AnalyticsDashboard.css';

// Importe as imagens de análise da pasta de assets
import dbscanImage from '../assets/leituraDBSCAN.png';
import torchImage from '../assets/leiturasTorch.png';

type AnalysisType = 'dbscan' | 'torch';

const AnalyticsDashboard: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('dbscan');

  const renderAnalysisInfo = () => {
    if (selectedAnalysis === 'dbscan') {
      return (
        <div className="dbscan-results-container">
          <h3>Análise Detalhada do Cluster DBSCAN</h3>
          <div className="result-item">
            <span className="label">Clusters encontrados:</span>
            <span className="value">[-1  0  1  2]</span>
          </div>
          <div className="result-item">
            <span className="label">Coeficiente de Silhueta (Silhouette Score):</span>
            <span className="value score">0.9857</span>
          </div>
          <h4 className="analysis-subtitle">Análise dos horários de refeição encontrados:</h4>
          <div className="cluster-details">
              <p className="cluster-title">Refeição (Cluster 0):</p>
              <ul>
                  <li>Aproximadamente às <strong>11:17</strong></li>
                  <li><strong>95</strong> leituras do sensor agrupadas.</li>
              </ul>
          </div>
          <div className="cluster-details">
              <p className="cluster-title">Refeição (Cluster 1):</p>
              <ul>
                  <li>Aproximadamente às <strong>19:22</strong></li>
                  <li><strong>10</strong> leituras do sensor agrupadas.</li>
              </ul>
          </div>
          <div className="cluster-details">
              <p className="cluster-title">Refeição (Cluster 2):</p>
              <ul>
                  <li>Aproximadamente às <strong>16:15</strong></li>
                  <li><strong>8</strong> leituras do sensor agrupadas.</li>
              </ul>
          </div>
        </div>
      );
    }
    return null;
  };


  const renderImage = () => {
    switch (selectedAnalysis) {
      case 'dbscan':
        return (
          <div>
            <img src={dbscanImage} alt="Análise DBSCAN" className="analysis-image" />
            {renderAnalysisInfo()}
          </div>
        );
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