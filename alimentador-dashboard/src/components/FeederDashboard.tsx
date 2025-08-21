// src/components/FeederDashboard.tsx
import React, { useState, useEffect } from 'react';
import { getLatestFeederData, FeederData } from '../services/api';
import './FeederDashboard.css'; // Criaremos este arquivo para o estilo

const FeederDashboard: React.FC = () => {
  // Estado para armazenar os dados do alimentador
  const [feederData, setFeederData] = useState<FeederData | null>(null);
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null); // Limpa erros anteriores
      const data = await getLatestFeederData();
      setFeederData(data);
    } catch (err) {
      setError("Falha ao carregar dados. Verifique se a API está no ar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca os dados assim que o componente é montado
    fetchData();

    // Configura um intervalo para atualizar os dados a cada 5 segundos
    const intervalId = setInterval(fetchData, 5000); // 5000 ms = 5s

    // Função de limpeza que será executada quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []); // O array vazio [] garante que o efeito rode apenas uma vez (na montagem)

  const getLevelMessage = (percentage: number) => {
    if (percentage > 75) return "Nível de Ração: Alto";
    if (percentage > 40) return "Nível de Ração: Médio";
    if (percentage > 15) return "Nível de Ração: Baixo";
    return "Nível de Ração: Crítico! Reabasteça.";
  };

  if (loading) {
    return <div className="dashboard-container"><h1>Carregando...</h1></div>;
  }

  if (error) {
    return <div className="dashboard-container error"><h1>Erro</h1><p>{error}</p></div>;
  }
  
  // A variável 'distance' do seu código representa a porcentagem
  const percentage = feederData ? Math.round(feederData.distance) : 0;
  const lastUpdate = feederData ? new Date(feederData.tempo).toLocaleString('pt-BR') : 'N/A';

  return (
    <div className="dashboard-container">
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