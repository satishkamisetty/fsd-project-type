import React from 'react';
import { Breathing } from '../components/Breathing';

export const BreathingPage: React.FC = () => {
  return (
    <>
      <section className="section bg-light" style={{ padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-tag">Pranayama Breathwork</span>
          <h1 className="section-title">Box Breathing Exercise</h1>
          <p className="section-subtitle">
            Four equal sides of breath: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. One complete 16-second cycle resets your autonomic nervous system.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breathing />

          <div className="section-header text-center" style={{ marginTop: '5rem' }}>
            <span className="section-tag">Science of Breath</span>
            <h2 className="section-title">How Box Breathing Works in the Body</h2>
            <p className="section-subtitle">Understanding the physiology behind 16-second respiratory cycles.</p>
          </div>

          <div className="grid grid-3">
            <div className="benefit-card">
              <div className="benefit-icon">🫀</div>
              <h3>Vagus Nerve Stimulation</h3>
              <p>Slow rhythmic inhalation followed by extended retention directly activates parasympathetic vagal tone, lowering high heart rates.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Stress Hormone Reduction</h3>
              <p>Within just 4 to 8 cycles (2 to 3 minutes), levels of blood cortisol and adrenaline decrease noticeably, restoring composure.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>High-Performance Focus</h3>
              <p>Used by tactical forces and elite athletes under pressure to maintain steady motor precision and emotional equilibrium.</p>
            </div>
          </div>

          <div style={{ background: 'var(--color-cream-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.8rem', marginTop: '3rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.8rem' }}>💡</div>
            <div>
              <h4 style={{ marginBottom: '0.35rem', color: 'var(--color-forest)' }}>Gentle Practice Advice</h4>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Always breathe smoothly through the diaphragm without hyperventilating or straining. If you feel lightheaded at any point, pause the exercise and return to your natural effortless breathing pattern.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
