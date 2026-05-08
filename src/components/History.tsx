import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock } from 'lucide-react';

export default function History() {
  const { sessions } = useAppContext();

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-md flex flex-col mt-lg">
      <h2 className="font-headline-md text-on-surface mb-md">Histórico Recente</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="py-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Tarefa</th>
              <th className="py-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Data</th>
              <th className="py-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Hora</th>
              <th className="py-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Duração</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-on-surface">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-lg text-center text-on-surface-variant bg-surface/50">
                  Nenhum pomodoro concluído ainda.
                </td>
              </tr>
            ) : (
              sessions.slice(0, 10).map((session) => (
                <tr key={session.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-1">{session.activityTitle || 'Sessão sem tarefa'}</td>
                  <td className="py-3 px-1">{new Date(session.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3 px-1">{session.time}</td>
                  <td className="py-3 px-1">
                    <span className="flex items-center gap-1">
                        <Clock size={16} className="text-secondary" />
                        {session.duration} min
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
