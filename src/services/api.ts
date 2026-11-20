/**
 * ZenZone – API Data Service
 * Implements Fetch API data communication with TypeScript types,
 * simulated network states, and localStorage persistence fallback.
 */

import { YogaPose, YogaSession } from '../types/session';
import initialPoses from '../data/poses.json';
import initialSessions from '../data/sessions.json';

const STORAGE_KEY = 'zenzone_react_sessions';

export const apiService = {
  /**
   * Fetch all yoga poses using the Fetch API
   */
  async getYogaPoses(): Promise<YogaPose[]> {
    try {
      const response = await fetch('/data/poses.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch poses: ${response.status} ${response.statusText}`);
      }
      const data: YogaPose[] = await response.json();
      return data;
    } catch (err) {
      console.warn('Fetch API error or offline mode, falling back to local dataset:', err);
      // Fallback to static JSON import
      return initialPoses as YogaPose[];
    }
  },

  /**
   * Fetch session history using Fetch API and local storage
   */
  async getSessions(): Promise<YogaSession[]> {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        return JSON.parse(localData) as YogaSession[];
      }

      // First time loading: try Fetch API
      const response = await fetch('/data/sessions.json');
      if (response.ok) {
        const data: YogaSession[] = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
      throw new Error('Default sessions could not be loaded via fetch');
    } catch (err) {
      console.warn('Using bundled initial sessions fallback:', err);
      const fallback = initialSessions as YogaSession[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  },

  /**
   * Add a newly completed yoga/meditation session
   */
  async addSession(newSession: Omit<YogaSession, 'id'>): Promise<YogaSession> {
    const sessions = await this.getSessions();
    const created: YogaSession = {
      ...newSession,
      id: Date.now(),
      date: newSession.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      completed: true
    };

    const updated = [created, ...sessions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return created;
  },

  /**
   * Clear all recorded sessions
   */
  async clearSessions(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
};
