import React from 'react';
import { YogaSession } from '../types/session';

interface SessionLogProps {
  sessions: YogaSession[];
  onClear: () => void;
  isLoading?: boolean;
}

export const SessionLog: React.FC<SessionLogProps> = ({ sessions, onClear, isLoading }) => {
  const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalCount = sessions.length;

  return (
    <div className="session-history-container">
      <div className="flex-between">
        <div>
          <h3>Your Practice & Meditation History</h3>
          <p>Track your mindful practice logs and personal streaks.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Total Time</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-forest)' }}>
              {totalMinutes} min
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Sessions</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-forest)' }}>
              {totalCount}
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClear}>
            Reset History
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-forest)' }}>
          <em>Loading sessions from API service...</em>
        </div>
      ) : (
        <table className="session-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Session</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '2rem' }}>
                  No meditation sessions recorded yet. Start a session above to record your journey!
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.date || 'Today'}</strong></td>
                  <td>{s.title}</td>
                  <td>⏱ {s.duration} min</td>
                  <td><span className="badge badge-sage">{s.category}</span></td>
                  <td><span className="status-badge-done">✓ Completed</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
