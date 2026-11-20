import React, { useState } from 'react';
import { Timer } from '../components/Timer';
import { SessionLog } from '../components/SessionLog';
import { YogaSession } from '../types/session';

interface MeditationPageProps {
  sessions: YogaSession[];
  onAddSession: (session: Omit<YogaSession, 'id'>) => void;
  onClearSessions: () => void;
  isLoading?: boolean;
  initialPreset?: { title: string; minutes: number } | null;
}

export const Meditation: React.FC<MeditationPageProps> = ({ 
  sessions, 
  onAddSession, 
  onClearSessions, 
  isLoading,
  initialPreset 
}) => {
  const [activePreset, setActivePreset] = useState<{ title: string; minutes: number } | undefined>(
    initialPreset || undefined
  );

  const handleSelectPreset = (title: string, minutes: number) => {
    setActivePreset({ title, minutes });
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <>
      <section className="section bg-light" style={{ padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-tag">Guided Mindfulness</span>
          <h1 className="section-title">Meditation Sanctuary & Timer</h1>
          <p className="section-subtitle">
            Center your mind, reduce anxiety, and cultivate stillness with guided sessions and our precision meditation timer.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Timer 
            onSessionComplete={onAddSession}
            initialPreset={activePreset}
          />

          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <span className="section-tag">Curated Practices</span>
            <h2 className="section-title">Explore Guided Intentions</h2>
            <p className="section-subtitle">Select any intention below to load it straight into your timer.</p>
          </div>

          <div className="grid grid-4">
            <div className="session-card">
              <div className="session-icon">🌅</div>
              <span className="session-pill">5 min</span>
              <h3>Morning Awakening</h3>
              <p>Start the day calmly. Set purposeful intentions, cultivate gratitude, and align mind with body.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleSelectPreset('Morning Awakening', 5)}
              >
                Load 5m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🍃</div>
              <span className="session-pill">10 min</span>
              <h3>Stress Relief</h3>
              <p>Relaxation practice. Gently release muscular contractions and calm anxious nervous loops.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleSelectPreset('Stress Relief', 10)}
              >
                Load 10m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🎯</div>
              <span className="session-pill">15 min</span>
              <h3>Focus & Clarity</h3>
              <p>Improve concentration. Anchor awareness on the sensation of breath at the nostrils to curb mind wandering.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleSelectPreset('Focus Meditation', 15)}
              >
                Load 15m Session
              </button>
            </div>

            <div className="session-card">
              <div className="session-icon">🌌</div>
              <span className="session-pill">20 min</span>
              <h3>Sleep Meditation</h3>
              <p>Prepare for sleep. Progressive body scan that guides your brain waves into relaxed theta state.</p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => handleSelectPreset('Sleep Meditation', 20)}
              >
                Load 20m Session
              </button>
            </div>
          </div>

          <SessionLog 
            sessions={sessions}
            onClear={onClearSessions}
            isLoading={isLoading}
          />
        </div>
      </section>
    </>
  );
};
