// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">{!isCollapsed ? 'Menu' : 'M'}</h2>
        <button onClick={toggleSidebar} className="toggle-btn">
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      <ul>
        <li>
          <NavLink to="/" end>
            <span className="link-icon">D</span>
            <span className="link-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics">
            <span className="link-icon">A</span>
            <span className="link-text">Análises</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;