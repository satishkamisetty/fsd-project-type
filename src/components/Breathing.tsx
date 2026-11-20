import React, { useState, useEffect } from 'react';

export const Breathing: React.FC = () => {
  const phases = [
    { name: 'Inhale', duration: 4, instruction: 'Inhale deeply and gently through your nose', scale: 1.6 },
    { name: 'Hold', duration: 4, instruction: 'Hold your lungs comfortably full', scale: 1.6 },
    { name: 'Exhale', duration: 4, instruction: 'Exhale slowly and smoothly through your mouth', scale: 1.0 },
    { name: 'Hold', duration: 4, instruction: 'Hold empty and relax your shoulders', scale: 1.0 }
  ];

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Next phase
            setCurrentPhaseIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % phases.length;
              if (nextIndex === 0) {
                setCompletedCycles((c) => c + 1);
              }
              return nextIndex;
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(4);
    setCompletedCycles(0);
  };

  const currentPhase = phases[currentPhaseIndex];

  return (
    <div className="breathing-hero-card">
      <div className="breath-cycle-badge">
        Completed Cycles: {completedCycles}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {phases.map((p, idx) => (
          <div 
            key={idx}
            className={`preset-pill ${idx === currentPhaseIndex ? 'active' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            {idx + 1}. {p.name} (4s)
          </div>
        ))}
      </div>

      <div className="circle-wrapper">
        <div className="breathing-outer-ring"></div>
        <div 
          className="breathing-animated-circle"
          style={{
            transform: isRunning ? `scale(${currentPhase.scale})` : 'scale(1)',
            transition: isRunning ? `transform ${currentPhase.duration}s cubic-bezier(0.4, 0, 0.2, 1)` : 'transform 0.5s ease-out'
          }}
        >
          <span className="breath-phase-text">{isRunning ? currentPhase.name : 'Ready'}</span>
          <span className="breath-timer-count">{isRunning ? secondsRemaining : '4'}</span>
        </div>
      </div>

      <p className="breath-instruction">
        {isRunning ? currentPhase.instruction : 'Sit comfortably with a straight spine. Press Start to begin your first breathing cycle.'}
      </p>

      <div className="timer-action-buttons" style={{ marginTop: '2rem' }}>
        {!isRunning ? (
          <button className="btn btn-primary" onClick={handleStart} style={{ minWidth: '140px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Breathing
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handlePause} style={{ minWidth: '140px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause
          </button>
        )}
        <button className="btn btn-outline" onClick={handleReset}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Reset
        </button>
      </div>
    </div>
  );
};
