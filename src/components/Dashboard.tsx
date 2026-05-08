import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Target, CheckCircle2, ListTodo, Timer as TimerIcon } from 'lucide-react';

export default function Dashboard() {
  const { activities, sessions } = useAppContext();

  const totalTasks = activities.length;
  const completedTasks = activities.filter((a) => a.status === 'concluida').length;
  const pendingTasks = activities.filter((a) => a.status !== 'concluida').length;
  
  // Pomodoros de hoje
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === today);
  const completedPomodoros = todaySessions.length;
  const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0); // in minutes

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
      <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-start">
        <div className="p-2 bg-primary/10 text-primary rounded-lg mb-sm">
          <ListTodo size={20} />
        </div>
        <p className="font-display text-headline-md font-bold text-on-surface">{totalTasks}</p>
        <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Total de Tarefas</p>
      </div>

      <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <CheckCircle2 size={80} />
        </div>
        <div className="p-2 bg-secondary/10 text-secondary rounded-lg mb-sm z-10">
          <CheckCircle2 size={20} />
        </div>
        <p className="font-display text-headline-md font-bold text-on-surface z-10">{completedTasks}</p>
        <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-1 z-10">Concluídas</p>
        <div className="w-full h-1 bg-surface-container mt-2 rounded-full overflow-hidden z-10">
           <div className="h-full bg-secondary" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-start">
        <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg mb-sm">
          <Target size={20} />
        </div>
        <p className="font-display text-headline-md font-bold text-on-surface">{completedPomodoros}</p>
        <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Pomodoros Hoje</p>
      </div>

      <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-start">
        <div className="p-2 bg-primary/10 text-primary rounded-lg mb-sm">
          <TimerIcon size={20} />
        </div>
        <p className="font-display text-headline-md font-bold text-on-surface">
          {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
        </p>
        <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Foco Hoje</p>
      </div>
    </div>
  );
}
