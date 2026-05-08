import React, { createContext, useContext, useEffect, useState } from 'react';
import { Activity, PomodoroSession, PomodoroSettings } from '../types';

interface AppContextData {
  activities: Activity[];
  sessions: PomodoroSession[];
  settings: PomodoroSettings;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'completedPomodoros' | 'status'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  updateSettings: (settings: PomodoroSettings) => void;
  addSession: (session: Omit<PomodoroSession, 'id' | 'date' | 'time'>) => void;
  resetData: () => void;
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('foco_diario_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('foco_diario_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem('foco_diario_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('foco_diario_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('foco_diario_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('foco_diario_settings', JSON.stringify(settings));
  }, [settings]);

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'completedPomodoros' | 'status'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      status: 'pendente',
      completedPomodoros: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates, updatedAt: new Date().toISOString() } : act))
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
  };

  const addSession = (session: Omit<PomodoroSession, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const newSession: PomodoroSession = {
      ...session,
      id: crypto.randomUUID(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const resetData = () => {
    setActivities([]);
    setSessions([]);
    setSettings(defaultSettings);
  };

  return (
    <AppContext.Provider
      value={{
        activities,
        sessions,
        settings,
        addActivity,
        updateActivity,
        deleteActivity,
        updateSettings,
        addSession,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
