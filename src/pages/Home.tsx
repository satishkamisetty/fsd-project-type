import React from 'react';
import { YogaPose } from '../types/session';

interface HomeProps {
  onSelectTab: (tab: string) => void;
  poses: YogaPose[];
  onSelectPose: (pose: YogaPose) => void;
  onStartMeditation: (preset: { title: string; minutes: number }) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTab, poses, onSelectPose, onStartMeditation }) => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-sage">Health & Wellness Sanctuary</span>
            <h1 className="hero-title">Find Your Inner Peace with <span>ZenZone</span></h1>
            <p className="hero-subtitle">
              Begin a transformative journey of mindfulness, flexibility, and physical vitality.
              Learn authentic yoga poses, guided meditations, and calming breathwork designed for beginners and beyond.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => onSelectTab('yoga')}>Explore Yoga Poses</button>
              <button className="btn btn-secondary" onClick={() => onSelectTab('breathing')}>Try Box Breathing</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">20+</span>
                <span className="stat-label">Curated Poses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free & Guided</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4-4-4</span>
                <span className="stat-label">Box Breathing</span>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <div className="serene-illustration">
              <svg viewBox="0 0 400 400" className="lotus-svg">
                <circle cx="200" cy="200" r="170" fill="#E8EFE5" opacity="0.8" />
                <circle cx="200" cy="200" r="130" fill="#A9BFA8" opacity="0.4" />
                <path d="M200 110 A22 22 0 1 0 200 154 A22 22 0 1 0 200 110" fill="#526B58"/>
                <path d="M200 160 C175 160 160 185 155 220 C150 245 165 255 180 255 C190 255 195 245 200 245 C205 245 210 255 220 255 C235 255 250 245 245 220 C240 185 225 160 200 160 Z" fill="#526B58"/>
                <path d="M150 230 C130 240 120 255 135 268 C155 278 185 275 200 275 C215 275 245 278 265 268 C280 255 270 240 250 230 C235 250 215 260 200 260 C185 260 165 250 150 230 Z" fill="#343D35" opacity="0.85"/>
                <path d="M200 280 C160 270 140 295 165 315 C185 325 200 300 200 280 Z" fill="#A9BFA8"/>
                <path d="M200 280 C240 270 260 295 235 315 C215 325 200 300 200 280 Z" fill="#A9BFA8"/>
                <path d="M200 275 C180 285 190 320 200 325 C210 320 220 285 200 275 Z" fill="#526B58"/>
              </svg>
              <div className="floating-badge badge-meditation">
                <span>🧘 Deep Focus</span>
              </div>
              <div className="floating-badge badge-breath">
                <span>🌿 Mindful Living</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Holistic Wellness</span>
            <h2 className="section-title">Why Practice with ZenZone?</h2>
            <p className="section-subtitle">Consistent mindful movement and breath control scientifically strengthen your body and calm your central nervous system.</p>
          </div>

          <div className="grid grid-4 benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🌿</div>
              <h3>Stress Reduction</h3>
              <p>Lower cortisol levels and soothe your nervous system through steady rhythmic breathing and restorative poses.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🧘</div>
              <h3>Flexibility & Core</h3>
              <p>Gradually lengthen muscles, improve joint lubrication, and build resilient core stability safely.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🧠</div>
              <h3>Mental Clarity</h3>
              <p>Sharpen focus, relieve cognitive fatigue, and cultivate emotional balance through guided meditation.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌙</div>
              <h3>Restorative Sleep</h3>
              <p>Quiet race thoughts at night and prepare your body for deep, rejuvenating rest with gentle wind-downs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Poses */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="section-tag">Asana Showcase</span>
              <h2 className="section-title">Featured Yoga Poses</h2>
              <p className="section-subtitle">Explore foundational postures with guided alignment cues and health benefits.</p>
            </div>
            <button className="btn btn-outline" onClick={() => onSelectTab('yoga')}>View All Poses →</button>
          </div>

          <div className="grid grid-3">
            {poses.slice(0, 3).map((pose) => (
              <article key={pose.id} className="pose-card">
                <div className="pose-image-box">
                  <svg viewBox="0 0 300 200" className="pose-svg">
                    <rect width="300" height="200" fill="#E8EFE5"/>
                    <circle cx="150" cy="50" r="14" fill="#526B58"/>
                    <line x1="150" y1="64" x2="150" y2="150" stroke="#526B58" strokeWidth="7" strokeLinecap="round"/>
                    <line x1="150" y1="85" x2="120" y2="125" stroke="#526B58" strokeWidth="6" strokeLinecap="round"/>
                    <line x1="150" y1="85" x2="180" y2="125" stroke="#526B58" strokeWidth="6" strokeLinecap="round"/>
                    <line x1="150" y1="150" x2="140" y2="190" stroke="#526B58" strokeWidth="6" strokeLinecap="round"/>
                    <line x1="150" y1="150" x2="160" y2="190" stroke="#526B58" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                  <span className={`card-badge ${pose.difficulty.toLowerCase()}`}>
                    {pose.difficulty}
                  </span>
                </div>
                <div className="pose-content">
                  <div className="pose-meta">
                    <span className="pose-sanskrit">{pose.sanskrit}</span>
                    <span className="pose-duration">⏱ {pose.duration}</span>
                  </div>
                  <h3 className="pose-name">{pose.name}</h3>
                  <p className="pose-desc">{pose.description}</p>
                  <div className="pose-benefits-tags">
                    {pose.benefits.slice(0, 2).map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </div>
                  <button 
                    className="btn-card-link"
                    onClick={() => onSelectPose(pose)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    View Details & Steps →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Meditation Sessions */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Mindfulness Sessions</span>
            <h2 className="section-title">Guided Meditation Sessions</h2>
            <p className="section-subtitle">Choose a session tuned to your intention and start immediately.</p>
          </div>

          <div className="grid grid-4">
            <div className="session-card">
              <div className="session-icon">🌅</div>
              <span className="session-pill">5 min</span>
              <h3>Morning Awakening</h3>
              <p>Ground your mindset with gratitude and positive intention to start your day calmly.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onStartMeditation({ title: 'Morning Awakening', minutes: 5 })}
              >
                Begin 5m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🍃</div>
              <span className="session-pill">10 min</span>
              <h3>Stress Relief</h3>
              <p>Unwind built-up muscle tension and release emotional overwhelm effectively.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onStartMeditation({ title: 'Stress Relief', minutes: 10 })}
              >
                Begin 10m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🎯</div>
              <span className="session-pill">15 min</span>
              <h3>Focus & Clarity</h3>
              <p>Anchor your attention to the breath to overcome brain fog and improve productivity.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onStartMeditation({ title: 'Focus Meditation', minutes: 15 })}
              >
                Begin 15m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🌌</div>
              <span className="session-pill">20 min</span>
              <h3>Deep Sleep Winddown</h3>
              <p>Gentle progressive body relaxation designed to lull you into deep, restorative sleep.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onStartMeditation({ title: 'Sleep Meditation', minutes: 20 })}
              >
                Begin 20m Session
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
