import React from 'react';
import { YogaPose } from '../types/session';

interface YogaCardProps {
  pose: YogaPose;
  onSelect: (pose: YogaPose) => void;
}

export const YogaCard: React.FC<YogaCardProps> = ({ pose, onSelect }) => {
  const getDifficultyClass = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return 'beginner';
    }
  };

  return (
    <article className="pose-card">
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
        <span className={`card-badge ${getDifficultyClass(pose.difficulty)}`}>
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
          onClick={() => onSelect(pose)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          View Details & Steps →
        </button>
      </div>
    </article>
  );
};
