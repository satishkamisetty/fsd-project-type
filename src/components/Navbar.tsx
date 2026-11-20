import React, { useState } from 'react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6a6 6 0 0 0-6 6c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
            <path d="M12 8v8"/>
          </svg>
          <span>ZenZone</span>
        </a>

        <button 
          className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`main-nav ${mobileOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <a 
                href="#home" 
                className={currentTab === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#yoga" 
                className={currentTab === 'yoga' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('yoga'); }}
              >
                Yoga Poses
              </a>
            </li>
            <li>
              <a 
                href="#meditation" 
                className={currentTab === 'meditation' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('meditation'); }}
              >
                Meditation
              </a>
            </li>
            <li>
              <a 
                href="#breathing" 
                className={currentTab === 'breathing' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('breathing'); }}
              >
                Breathing
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={currentTab === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
              >
                About & Contact
              </a>
            </li>
          </ul>
          <div className="nav-cta">
            <button 
              className="btn btn-primary"
              onClick={() => handleNavClick('meditation')}
            >
              Start Practicing
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
