import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Activity } from './types';
import Timer from './components/Timer';
import TaskBoard from './components/TaskBoard';
import Dashboard from './components/Dashboard';
import History from './components/History';
import SettingsModal from './components/SettingsModal';
import { Timer as TimerIcon } from 'lucide-react';

type Tab = 'inicio' | 'historico';

function FocoDiarioApp() {
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('inicio');

  return (
    <div className="min-h-screen bg-[#f8f9fa] app-container">
      <header className="bg-white border-b border-gray-200">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-full">
              <TimerIcon size={24} />
            </div>
            <div className="font-display text-xl font-bold tracking-tight text-on-surface">
              Foco Diário
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('inicio')}
              className={`px-4 py-2 rounded-full font-label-bold text-sm transition-colors ${
                currentTab === 'inicio' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setCurrentTab('historico')}
              className={`px-4 py-2 rounded-full font-label-bold text-sm transition-colors ${
                currentTab === 'historico' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Histórico
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2 rounded-full font-label-bold text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            >
              Configurações
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-8 pb-xl px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-[#0f172a] mb-2">Seu dia em foco</h1>
          <p className="text-gray-500 font-body-md">
            Acompanhe seu progresso, gerencie atividades e mantenha o ritmo com a técnica Pomodoro.
          </p>
        </div>

        {currentTab === 'inicio' ? (
          <>
            <Dashboard />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-8">
              <Timer selectedActivity={selectedTask} />
              <TaskBoard onSelectTask={setSelectedTask} selectedTaskId={selectedTask?.id || null} />
            </div>
          </>
        ) : (
          <History />
        )}
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
