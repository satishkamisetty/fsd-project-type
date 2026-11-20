import React, { useState, useEffect, useRef } from 'react';
import { YogaSession } from '../types/session';

interface TimerProps {
  onSessionComplete: (session: Omit<YogaSession, 'id'>) => void;
  initialPreset?: { title: string; minutes: number };
}

export const Timer: React.FC<TimerProps> = ({ onSessionComplete, initialPreset }) => {
  const [minutes, setMinutes] = useState(initialPreset ? initialPreset.minutes : 5);
  const [sessionTitle, setSessionTitle] = useState(initialPreset ? initialPreset.title : 'Morning Meditation');
  const [timeRemaining, setTimeRemaining] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (initialPreset) {
      setMinutes(initialPreset.minutes);
      setSessionTitle(initialPreset.title);
      setTimeRemaining(initialPreset.minutes * 60);
      setIsRunning(false);
    }
  }, [initialPreset]);

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      setIsRunning(false);
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const playSingingBowlChime = () => {
    if (!chimeEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const freqs = [261.63, 523.25, 784.88, 1046.5];
      const gains = [0.4, 0.25, 0.15, 0.08];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(gains[i], ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 4.6);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  const handleComplete = () => {
    playSingingBowlChime();
    onSessionComplete({
      title: sessionTitle,
      duration: minutes,
      category: 'Meditation',
      completed: true
    });
    alert(`✨ Namaste! You completed ${sessionTitle} (${minutes} min). Your practice has been logged.`);
    setTimeRemaining(minutes * 60);
  };

  const selectPreset = (m: number, title: string) => {
    setIsRunning(false);
    setMinutes(m);
    setSessionTitle(title);
    setTimeRemaining(m * 60);
  };

  const handleStart = () => {
    // Prime audio
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      } catch (err) {}
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(minutes * 60);
  };

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalSecs = minutes * 60;
  const progressFraction = totalSecs > 0 ? (totalSecs - timeRemaining) / totalSecs : 0;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div className="timer-widget">
      <span className="badge badge-sage" style={{ marginBottom: '1.5rem' }}>Interactive Meditation Companion</span>
      <h2 style={{ marginBottom: '1.5rem' }}>{sessionTitle}</h2>

      <div className="timer-preset-pills">
        <button 
          className={`preset-pill ${minutes === 5 ? 'active' : ''}`}
          onClick={() => selectPreset(5, 'Morning Meditation')}
        >
          5 Min (Morning)
        </button>
        <button 
          className={`preset-pill ${minutes === 10 ? 'active' : ''}`}
          onClick={() => selectPreset(10, 'Stress Relief')}
        >
          10 Min (Stress Relief)
        </button>
        <button 
          className={`preset-pill ${minutes === 15 ? 'active' : ''}`}
          onClick={() => selectPreset(15, 'Focus Meditation')}
        >
          15 Min (Focus)
        </button>
        <button 
          className={`preset-pill ${minutes === 20 ? 'active' : ''}`}
          onClick={() => selectPreset(20, 'Sleep Meditation')}
        >
          20 Min (Deep Sleep)
        </button>
      </div>

      <div className="timer-ring-container">
        <svg className="timer-svg" viewBox="0 0 240 240">
          <circle className="timer-svg-bg" cx="120" cy="120" r={radius} />
          <circle 
            className="timer-svg-progress" 
            cx="120" 
            cy="120" 
            r={radius}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: strokeDashoffset
            }}
          />
        </svg>
        <div className="timer-clock-text">
          <div className="timer-digits">{formattedTime}</div>
          <span className="timer-session-label">Remaining Time</span>
        </div>
      </div>

      <div className="timer-action-buttons">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={handleStart} style={{ minWidth: '130px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handlePause} style={{ minWidth: '130px' }}>
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

      <div style={{ marginTop: '1.5rem' }}>
        <label className="chime-toggle">
          <input 
            type="checkbox" 
            checked={chimeEnabled}
            onChange={(e) => setChimeEnabled(e.target.checked)}
          />
          <span>🔔 Tibetan Singing Bowl chime upon completion</span>
        </label>
      </div>
    </div>
  );
};
