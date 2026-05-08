import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Activity } from './types';
import Timer from './components/Timer';
import TaskBoard from './components/TaskBoard';
import Dashboard from './components/Dashboard';
import History from './components/History';
import SettingsModal from './components/SettingsModal';
import { Settings as SettingsIcon } from 'lucide-react';

function FocoDiarioApp() {
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen app-container">
      <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center w-full px-md py-sm max-w-container-max mx-auto h-20">
          <div className="font-display text-headline-md font-extrabold tracking-tight text-primary">
            Foco Diário
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            title="Configurações"
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      <main className="pt-28 pb-xl px-md max-w-container-max mx-auto">
        <Dashboard />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-7">
            <Timer selectedActivity={selectedTask} />
          </div>
          <div className="lg:col-span-5 relative">
            <TaskBoard onSelectTask={setSelectedTask} selectedTaskId={selectedTask?.id || null} />
          </div>
        </div>

        <History />
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FocoDiarioApp />
    </AppProvider>
  );
}
