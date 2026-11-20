import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Yoga } from './pages/Yoga';
import { Meditation } from './pages/Meditation';
import { BreathingPage } from './pages/BreathingPage';
import { AboutContact } from './pages/AboutContact';
import { apiService } from './services/api';
import { YogaPose, YogaSession } from './types/session';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [activeMeditationPreset, setActiveMeditationPreset] = useState<{ title: string; minutes: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial data via Fetch API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [loadedPoses, loadedSessions] = await Promise.all([
          apiService.getYogaPoses(),
          apiService.getSessions()
        ]);
        setPoses(loadedPoses);
        setSessions(loadedSessions);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddSession = async (newSession: Omit<YogaSession, 'id'>) => {
    try {
      const added = await apiService.addSession(newSession);
      setSessions((prev) => [added, ...prev]);
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const handleClearSessions = async () => {
    if (window.confirm('Are you sure you want to clear your meditation logs?')) {
      await apiService.clearSessions();
      setSessions([]);
    }
  };

  const handleStartMeditationFromHome = (preset: { title: string; minutes: number }) => {
    setActiveMeditationPreset(preset);
    setCurrentTab('meditation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      <main>
        {currentTab === 'home' && (
          <Home 
            onSelectTab={handleSelectTab}
            poses={poses}
            onSelectPose={(p) => { setSelectedPose(p); setCurrentTab('yoga'); }}
            onStartMeditation={handleStartMeditationFromHome}
          />
        )}

        {currentTab === 'yoga' && (
          <Yoga 
            poses={poses}
            selectedPose={selectedPose}
            onSelectPose={setSelectedPose}
            isLoading={loading}
          />
        )}

        {currentTab === 'meditation' && (
          <Meditation 
            sessions={sessions}
            onAddSession={handleAddSession}
            onClearSessions={handleClearSessions}
            isLoading={loading}
            initialPreset={activeMeditationPreset}
          />
        )}

        {currentTab === 'breathing' && (
          <BreathingPage />
        )}

        {currentTab === 'about' && (
          <AboutContact />
        )}
      </main>

      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
};

export default App;
