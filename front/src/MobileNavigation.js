import React from 'react';
import './App.css';

const MobileNavigation = ({ tabs, activeTab, setActiveTab, disabled }) => {
  if (disabled || !tabs || tabs.length === 0) {
    return null;
  }

  return (
    <nav className="new-mobile-bottom-nav d-lg-none">
      <div className="d-flex justify-content-around align-items-center h-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`mobile-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            disabled={tab.disabled}
            aria-label={tab.label}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
