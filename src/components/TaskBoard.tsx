import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Priority } from '../types';
import { Plus, Play, MoreVertical, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';

export default function TaskBoard({ onSelectTask, selectedTaskId }: { onSelectTask: (activity: Activity | null) => void, selectedTaskId: string | null }) {
  const { activities, addActivity, updateActivity, deleteActivity } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('media');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addActivity({
      title: newTaskTitle,
      priority: newTaskPriority,
      estimatedPomodoros: newTaskPomodoros,
    });

    setNewTaskTitle('');
    setNewTaskPriority('media');
    setNewTaskPomodoros(1);
    setIsAdding(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta': return 'text-primary bg-primary/10 border-primary/20';
      case 'media': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'baixa': return 'text-on-surface-variant bg-surface-container border-outline-variant/20';
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    if (a.status === 'concluida' && b.status !== 'concluida') return 1;
    if (a.status !== 'concluida' && b.status === 'concluida') return -1;
    
    const priorityWeight = { alta: 3, media: 2, baixa: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-md flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-md">
        <h2 className="font-headline-md text-on-surface">Tarefas do Dia</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-xs px-sm py-xs bg-primary/10 text-primary rounded-lg font-label-bold hover:bg-primary/20 transition-colors"
          >
            <Plus size={18} />
            Nova
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="mb-md p-md bg-surface border border-outline-variant rounded-lg space-y-sm animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            placeholder="O que você precisa fazer?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
            autoFocus
          />
          <div className="flex gap-sm items-center">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="bg-surface-container-lowest border border-outline-variant rounded p-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded px-2">
              <span className="text-sm text-on-surface-variant">Est. Pomodoros:</span>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
                className="w-12 p-1 text-center bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-sm pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-sm py-1 font-label-bold text-on-surface-variant hover:text-on-surface">
              Cancelar
            </button>
            <button type="submit" className="px-sm py-1 bg-primary text-on-primary rounded font-label-bold">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {sortedActivities.length === 0 && !isAdding ? (
          <div className="text-center py-xl text-on-surface-variant">
            <p className="font-body-md">Nenhuma tarefa para hoje.</p>
            <p className="font-label-sm mt-1">Adicione uma tarefa para começar.</p>
          </div>
        ) : (
          sortedActivities.map(activity => (
            <div 
              key={activity.id} 
              className={`flex items-center gap-sm p-sm rounded-lg border group transition-all ${
                activity.status === 'concluida' 
                  ? 'bg-surface-container/50 border-transparent opacity-60' 
                  : selectedTaskId === activity.id 
                  ? 'bg-primary/5 border-primary shadow-sm' 
                  : 'bg-surface border-outline-variant/30 hover:border-outline-variant'
              }`}
            >
              <button 
                onClick={() => updateActivity(activity.id, { status: activity.status === 'concluida' ? 'pendente' : 'concluida' })}
                className="text-on-surface-variant hover:text-secondary flex-shrink-0"
              >
                {activity.status === 'concluida' ? <CheckCircle size={22} className="text-secondary" /> : <Circle size={22} />}
              </button>
              
              <div className="flex-1 min-w-0 flex flex-col cursor-default">
                <span className={`font-body-md truncate ${activity.status === 'concluida' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                  {activity.title}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityColor(activity.priority)}`}>
                    {activity.priority}
                  </span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    {activity.completedPomodoros} / {activity.estimatedPomodoros} 🍅
                  </span>
                </div>
              </div>

              {activity.status !== 'concluida' && (
                <button
                  onClick={() => onSelectTask(selectedTaskId === activity.id ? null : activity)}
                  className={`p-2 rounded-full flex-shrink-0 transition-colors ${
                    selectedTaskId === activity.id 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                  }`}
                  title={selectedTaskId === activity.id ? "Remover do Foco" : "Focar nesta tarefa"}
                >
                  <Play size={18} className={selectedTaskId === activity.id ? "fill-current" : ""} />
                </button>
              )}
              
              <div className="relative flex items-center">
                <button 
                  onClick={() => deleteActivity(activity.id)}
                  className="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
