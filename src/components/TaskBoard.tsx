import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Priority } from '../types';
import { Plus, Play, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';

export default function TaskBoard({ onSelectTask, selectedTaskId }: { onSelectTask: (activity: Activity | null) => void, selectedTaskId: string | null }) {
  const { activities, addActivity, updateActivity, deleteActivity } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('media');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addActivity({
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      estimatedPomodoros: newTaskPomodoros,
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('media');
    setNewTaskPomodoros(1);
    setIsAdding(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta': return 'text-[#c4461c] bg-[#fff3ef]';
      case 'media': return 'text-[#a22e02] bg-[#ffdbd0]';
      case 'baixa': return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'em_andamento': return 'Em andamento';
      default: return 'Pendente';
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    if (a.status === 'concluida' && b.status !== 'concluida') return 1;
    if (a.status !== 'concluida' && b.status === 'concluida') return -1;
    
    const priorityWeight = { alta: 3, media: 2, baixa: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <div className='flex flex-col h-full'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Atividades</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d32f2f] text-white rounded-lg font-label-bold text-sm hover:bg-[#ba1a1a] transition-colors"
          >
            <Plus size={16} />
            Nova
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddTask} className="mb-6 p-4 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            placeholder="Título da atividade"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] transition-colors"
            autoFocus
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] transition-colors"
            rows={2}
          />
          <div className="flex gap-4 items-center">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:border-[#d32f2f]"
            >
              <option value="baixa">Prioridade Baixa</option>
              <option value="media">Prioridade Média</option>
              <option value="alta">Prioridade Alta</option>
            </select>
            
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="text-sm text-gray-500">Pomodoros:</span>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-transparent focus:outline-none text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 font-label-bold text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-[#d32f2f] text-white rounded-lg font-label-bold text-sm hover:bg-[#ba1a1a] transition-colors">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {sortedActivities.length === 0 && !isAdding ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-sm">Nenhuma tarefa para hoje.</p>
          </div>
        ) : (
          sortedActivities.map(activity => (
            <div 
              key={activity.id} 
              className={`p-4 rounded-xl border transition-all ${
                activity.status === 'concluida' 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : selectedTaskId === activity.id 
                  ? 'bg-white border-[#d32f2f] shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className={`font-semibold text-lg leading-tight ${activity.status === 'concluida' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {activity.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activity.status !== 'concluida' && (
                    <button
                      onClick={() => onSelectTask(selectedTaskId === activity.id ? null : activity)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTaskId === activity.id 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-[#d32f2f] text-white hover:bg-[#ba1a1a]'
                      }`}
                    >
                      <Play size={14} className={selectedTaskId !== activity.id ? "fill-current" : ""} />
                      {selectedTaskId === activity.id ? 'Pausar' : 'Iniciar foco'}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => updateActivity(activity.id, { status: activity.status === 'concluida' ? 'pendente' : 'concluida' })}
                    className="p-1.5 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors"
                    title={activity.status === 'concluida' ? 'Desmarcar' : 'Concluir'}
                  >
                    <CheckCircle size={18} className={activity.status === 'concluida' ? 'text-green-600' : ''} />
                  </button>
                  
                  <button 
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  
                  <button 
                    onClick={() => deleteActivity(activity.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityColor(activity.priority)}`}>
                  {activity.priority}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-600 border border-gray-200">
                  {getStatusLabel(activity.status)}
                </span>
              </div>

              {activity.description && (
                <p className="text-gray-500 text-sm mb-3">
                  {activity.description}
                </p>
              )}

              <div className="text-sm font-medium text-gray-500">
                Pomodoros: <strong className="text-gray-900">{activity.completedPomodoros}</strong> / {activity.estimatedPomodoros}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
