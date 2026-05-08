import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Target, CheckCircle2, ListTodo, Timer as TimerIcon, Flame, Percent } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <ListTodo size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Total</span>
          <span className="text-xl font-bold text-gray-900 leading-tight">{totalTasks}</span>
        </div>
      </div>

      {/* Concluídas */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Concluídas</span>
          <span className="text-xl font-bold text-gray-900 leading-tight">{completedTasks}</span>
        </div>
      </div>

      {/* Pendentes */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <Target size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Pendentes</span>
          <span className="text-xl font-bold text-gray-900 leading-tight">{pendingTasks}</span>
        </div>
      </div>

      {/* Pomodoros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <Flame size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Pomodoros</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900 leading-tight">{completedPomodoros}</span>
            <span className="text-[10px] text-gray-400">hoje</span>
          </div>
        </div>
      </div>

      {/* Foco */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <TimerIcon size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Foco</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900 leading-tight">{totalFocusTime} min</span>
            <span className="text-[10px] text-gray-400">hoje</span>
          </div>
        </div>
      </div>

      {/* Conclusão */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
          <Percent size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-medium">Conclusão</span>
          <span className="text-xl font-bold text-gray-900 leading-tight">{completionPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
