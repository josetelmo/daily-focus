export type Priority = 'baixa' | 'media' | 'alta';
export type ActivityStatus = 'pendente' | 'em_andamento' | 'concluida';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  activityId?: string;
  activityTitle?: string;
  date: string;
  time: string;
  duration: number; // in minutes
}
