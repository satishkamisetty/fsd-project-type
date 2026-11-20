import React, { useState } from 'react';
import { YogaPose } from '../types/session';
import { YogaCard } from '../components/YogaCard';

interface YogaPageProps {
  poses: YogaPose[];
  selectedPose: YogaPose | null;
  onSelectPose: (pose: YogaPose | null) => void;
  isLoading?: boolean;
}

export const Yoga: React.FC<YogaPageProps> = ({ poses, selectedPose, onSelectPose, isLoading }) => {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate'>('all');
  const [search, setSearch] = useState('');

  const filteredPoses = poses.filter((p) => {
    const matchesFilter = filter === 'all' || p.difficulty.toLowerCase() === filter;
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sanskrit.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <section className="section bg-light" style={{ padding: '4rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-tag">Asana Sanctuary</span>
          <h1 className="section-title">Yoga Pose Gallery</h1>
          <p className="section-subtitle">
            Explore classical postures with step-by-step alignment guidance, anatomical benefits, and recommended durations for your daily practice.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Poses
              </button>
              <button 
                className={`filter-btn ${filter === 'beginner' ? 'active' : ''}`}
                onClick={() => setFilter('beginner')}
              >
                Beginner
              </button>
              <button 
                className={`filter-btn ${filter === 'intermediate' ? 'active' : ''}`}
                onClick={() => setFilter('intermediate')}
              >
                Intermediate
              </button>
            </div>
            <div style={{ minWidth: '260px' }}>
              <input 
                type="text"
                className="form-control"
                placeholder="Search poses (e.g. Tree, Cobra)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '0.55rem 1rem' }}
              />
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-forest)' }}>
              <em>Retrieving poses via Fetch API...</em>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredPoses.map((pose) => (
                <YogaCard 
                  key={pose.id} 
                  pose={pose} 
                  onSelect={(p) => onSelectPose(p)} 
                />
              ))}
            </div>
          )}

          {/* Modal for Pose Details */}
          {selectedPose && (
            <div className="modal-overlay active" onClick={() => onSelectPose(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => onSelectPose(null)}>&times;</button>
                <span className="badge badge-sage" style={{ marginBottom: '0.75rem' }}>
                  {selectedPose.difficulty} • {selectedPose.duration}
                </span>
                <h2 style={{ marginBottom: '0.5rem' }}>{selectedPose.name}</h2>
                <p style={{ fontStyle: 'italic', color: 'var(--color-forest)', marginBottom: '1.25rem' }}>
                  {selectedPose.sanskrit}
                </p>
                <p style={{ marginBottom: '1.5rem' }}>{selectedPose.description}</p>

                <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Key Health Benefits:</h4>
                <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-charcoal-light)' }}>
                  {selectedPose.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Alignment Steps:</h4>
                <ol style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-charcoal-light)', lineHeight: 1.7 }}>
                  {selectedPose.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <div style={{ background: 'var(--color-sage-soft)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                  <strong>💡 Mindful Alignment:</strong> Never force any posture. Breathe smoothly through the nose and ease out of the pose if tension arises.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
