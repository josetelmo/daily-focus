import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Activity } from '../types';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export default function Timer({ selectedActivity }: { selectedActivity: Activity | null }) {
  const { settings, updateActivity, addSession } = useAppContext();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const selectedActivityRef = useRef(selectedActivity);
  useEffect(() => {
    selectedActivityRef.current = selectedActivity;
  }, [selectedActivity]);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  useEffect(() => {
    setTimeLeft(
      mode === 'focus'
        ? settings.focusDuration * 60
        : mode === 'shortBreak'
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
    );
  }, [mode, settings]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (soundRef.current) {
      soundRef.current.play().catch(console.error);
    }

    if (mode === 'focus') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      const activity = selectedActivityRef.current;
      
      if (activity) {
        updateActivity(activity.id, {
          completedPomodoros: activity.completedPomodoros + 1,
          status: activity.status === 'pendente' ? 'em_andamento' : activity.status
        });
        
        addSession({
          activityId: activity.id,
          activityTitle: activity.title,
          duration: settings.focusDuration
        });
      } else {
        addSession({
          activityTitle: 'Sessão livre',
          duration: settings.focusDuration
        });
      }

      if (newCycles % settings.cyclesBeforeLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('focus');
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(settings.focusDuration * 60);
  };

  const skipBreak = () => {
    if (mode !== 'focus') {
      setIsActive(false);
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' 
    ? settings.focusDuration * 60 
    : mode === 'shortBreak' 
    ? settings.shortBreakDuration * 60 
    : settings.longBreakDuration * 60;

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#ffdad6] flex flex-col items-center justify-center p-8 relative w-full h-full min-h-[400px]">
      
      <div className="flex items-center gap-4 mb-4">
        <span className={`px-4 py-1 rounded-full text-sm font-bold text-white ${mode === 'focus' ? 'bg-[#d32f2f]' : 'bg-[#005faf]'}`}>
          {mode === 'focus' ? 'Foco' : mode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
        </span>
        <span className="text-gray-500 font-medium">Ciclos: {cycles}</span>
      </div>

      <div className="mb-8 text-center truncate w-full px-8">
        <span className="text-gray-500 mr-2">Em foco:</span>
        <span className="font-semibold text-gray-900 truncate">
          {selectedActivity ? selectedActivity.title : 'Sessão livre'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 w-full px-12">
        <span className="font-display font-extrabold text-[100px] leading-tight text-[#0f172a] tracking-tight transition-all tabular-nums">
          {formatTime(timeLeft)}
        </span>
        
        <div className="w-full max-w-md h-3 bg-gray-100 rounded-full mt-6 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${mode === 'focus' ? 'bg-[#0f172a]' : 'bg-[#005faf]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-label-bold text-white transition-all shadow-sm ${
            mode === 'focus' ? 'bg-[#d32f2f] hover:bg-[#ba1a1a]' : 'bg-[#005faf] hover:bg-[#004786]'
          }`}
        >
          {isActive ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
          {isActive ? 'Pausar' : mode === 'focus' ? 'Iniciar' : 'Começar Pausa'}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all font-label-bold shadow-sm"
        >
          <RotateCcw size={18} />
          Reiniciar
        </button>

        {mode !== 'focus' && (
          <button
            onClick={skipBreak}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all font-label-bold shadow-sm"
          >
            <SkipForward size={18} />
            Pular
          </button>
        )}
      </div>
    </div>
  );
}
