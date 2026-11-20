import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div class="footer-brand">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6a6 6 0 0 0-6 6c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
            </svg>
            <span>ZenZone</span>
          </div>
          <p>Your sanctuary for mindful living, authentic yoga asana guidance, and soothing breath exercises.</p>
          <p className="tagline">Calm • Mindful • Balanced</p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); onSelectTab('home'); }}>Home</a></li>
            <li><a href="#yoga" onClick={(e) => { e.preventDefault(); onSelectTab('yoga'); }}>Yoga Poses</a></li>
            <li><a href="#meditation" onClick={(e) => { e.preventDefault(); onSelectTab('meditation'); }}>Meditation Timer</a></li>
            <li><a href="#breathing" onClick={(e) => { e.preventDefault(); onSelectTab('breathing'); }}>Box Breathing</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onSelectTab('about'); }}>About & Contact</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Health & Fitness</h4>
          <ul>
            <li><a href="#yoga" onClick={(e) => { e.preventDefault(); onSelectTab('yoga'); }}>Beginner Asanas</a></li>
            <li><a href="#breathing" onClick={(e) => { e.preventDefault(); onSelectTab('breathing'); }}>Pranayama Basics</a></li>
            <li><a href="#meditation" onClick={(e) => { e.preventDefault(); onSelectTab('meditation'); }}>Mindfulness Sessions</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Weekly Calm Digest</h4>
          <p>Receive weekly mindful routines, posture tips, and guided sequences.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to ZenZone Calm Digest!'); }}>
            <input type="email" placeholder="Your email address..." required />
            <button type="submit" className="btn btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container flex-between">
          <p>&copy; 2026 ZenZone. Module 4 Dynamic React + TypeScript Web Application.</p>
          <p className="author">Crafted with Soft Sage & Forest Greens for Healthy Living</p>
        </div>
      </div>
    </footer>
  );
};
