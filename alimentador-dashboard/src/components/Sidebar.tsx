// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul>
        <li>
          <Link to="/">Dashboard Alimentadores</Link>
        </li>
        <li>
          <Link to="/analytics">Análise dos Alimentadores</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;