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

  // Keep a ref of current activity for closure issues
  const selectedActivityRef = useRef(selectedActivity);
  useEffect(() => {
    selectedActivityRef.current = selectedActivity;
  }, [selectedActivity]);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create an audio element for the alarm
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
      
      // Update Activity
      if (activity) {
        updateActivity(activity.id, {
          completedPomodoros: activity.completedPomodoros + 1,
          status: activity.status === 'pendente' ? 'em_andamento' : activity.status
        });
        
        // Register Session
        addSession({
          activityId: activity.id,
          activityTitle: activity.title,
          duration: settings.focusDuration
        });
      } else {
        // Register Unlinked Session
        addSession({
          activityTitle: 'Sessão sem tarefa',
          duration: settings.focusDuration
        });
      }

      // Determine next break
      if (newCycles % settings.cyclesBeforeLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      // Break is over, back to focus
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
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' 
    ? settings.focusDuration * 60 
    : mode === 'shortBreak' 
    ? settings.shortBreakDuration * 60 
    : settings.longBreakDuration * 60;

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm flex flex-col items-center justify-center border border-outline-variant/20 relative w-full h-full min-h-[400px]">
      
      <div className="flex gap-sm mb-lg bg-surface-container p-1 rounded-full">
        <button
          onClick={() => { setIsActive(false); setMode('focus'); }}
          className={`px-sm py-1 rounded-full font-label-bold text-sm transition-all ${mode === 'focus' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Foco
        </button>
        <button
          onClick={() => { setIsActive(false); setMode('shortBreak'); }}
          className={`px-sm py-1 rounded-full font-label-bold text-sm transition-all ${mode === 'shortBreak' ? 'bg-secondary text-on-secondary shadow' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Pausa Curta
        </button>
        <button
          onClick={() => { setIsActive(false); setMode('longBreak'); }}
          className={`px-sm py-1 rounded-full font-label-bold text-sm transition-all ${mode === 'longBreak' ? 'bg-secondary text-on-secondary shadow' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Pausa Longa
        </button>
      </div>

      <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-lg">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            className="text-surface-container-highest"
            cx="50%"
            cy="50%"
            fill="none"
            r="48%"
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            className={mode === 'focus' ? 'text-primary transition-all duration-1000' : 'text-secondary transition-all duration-1000'}
            cx="50%"
            cy="50%"
            fill="none"
            r="48%"
            stroke="currentColor"
            strokeDasharray={`${2 * Math.PI * 48}%`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}%`}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-display text-on-surface z-10 transition-all">
          {formatTime(timeLeft)}
        </span>
        <span className="font-label-bold text-on-surface-variant mt-2 tracking-widest uppercase text-xs z-10">
          {mode === 'focus' ? 'Foque' : mode === 'shortBreak' ? 'Relaxe' : 'Descanse'}
        </span>
      </div>

      <div className="flex items-center gap-md">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ${
            mode === 'focus' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'
          }`}
        >
          {isActive ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full border-2 border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all"
          title="Reiniciar"
        >
          <RotateCcw size={20} />
        </button>

        {mode !== 'focus' && (
          <button
            onClick={skipBreak}
            className="w-12 h-12 rounded-full border-2 border-outline-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all"
            title="Pular pausa"
          >
            <SkipForward size={20} />
          </button>
        )}
      </div>

      {selectedActivity && mode === 'focus' && (
        <div className="mt-md text-center max-w-xs truncate">
          <p className="font-label-sm text-on-surface-variant uppercase mb-1">Trabalhando em:</p>
          <p className="font-body-md text-on-surface font-semibold truncate">{selectedActivity.title}</p>
        </div>
      )}
    </div>
  );
}
