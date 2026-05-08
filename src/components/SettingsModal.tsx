import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  return (
    <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="bg-surface-container-lowest rounded-xl max-w-md w-full shadow-2xl p-lg animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-md">
          <h2 className="font-headline-md text-on-surface">Configurações</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block font-label-bold text-on-surface-variant mb-1">Foco (minutos)</label>
            <input
              type="number"
              name="focusDuration"
              min="1"
              max="120"
              value={localSettings.focusDuration}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-bold text-on-surface-variant mb-1">Pausa Curta (minutos)</label>
            <input
              type="number"
              name="shortBreakDuration"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-bold text-on-surface-variant mb-1">Pausa Longa (minutos)</label>
            <input
              type="number"
              name="longBreakDuration"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-bold text-on-surface-variant mb-1">Ciclos antes da pausa longa</label>
            <input
              type="number"
              name="cyclesBeforeLongBreak"
              min="1"
              max="10"
              value={localSettings.cyclesBeforeLongBreak}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="pt-sm flex justify-end gap-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-sm rounded-lg font-label-bold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
