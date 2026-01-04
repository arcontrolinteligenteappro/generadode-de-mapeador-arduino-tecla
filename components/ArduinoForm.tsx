import React from 'react';
import { BoardType, TriggerType, GeneratorConfig } from '../types';
import { Cpu, Keyboard, Zap, Settings2 } from 'lucide-react';
import { Icon } from './Icon';

interface ArduinoFormProps {
  config: GeneratorConfig;
  onChange: (config: GeneratorConfig) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ArduinoForm: React.FC<ArduinoFormProps> = ({ config, onChange, onSubmit, isLoading }) => {
  
  const handleChange = (field: keyof GeneratorConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-teal-400 flex items-center gap-2">
        <Icon icon={Settings2} size={24} />
        Configuración del Dispositivo
      </h2>
      
      <div className="space-y-6">
        {/* Board Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Icon icon={Cpu} size={16} /> Placa Arduino
          </label>
          <select
            value={config.board}
            onChange={(e) => handleChange('board', e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          >
            <option value={BoardType.UNO}>Arduino Uno (Requiere software extra)</option>
            <option value={BoardType.LEONARDO}>Arduino Leonardo/Micro (Nativo HID)</option>
          </select>
          {config.board === BoardType.UNO && (
            <p className="text-xs text-amber-400 bg-amber-900/20 p-2 rounded border border-amber-900/50">
              Nota: El Arduino Uno no puede actuar como teclado USB directamente sin flashear firmware avanzado o usar programas puente.
            </p>
          )}
        </div>

        {/* Pin Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Icon icon={Zap} size={16} /> Pin Digital
            </label>
            <input
              type="number"
              min="0"
              max="13"
              value={config.pin}
              onChange={(e) => handleChange('pin', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ej: 2"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Icon icon={Keyboard} size={16} /> Tecla a Mapear
            </label>
            <input
              type="text"
              value={config.key}
              onChange={(e) => handleChange('key', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ej: A, Space, Enter"
            />
          </div>
        </div>

        {/* Trigger Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Modo de Conexión</label>
          <select
            value={config.trigger}
            onChange={(e) => handleChange('trigger', e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value={TriggerType.PULLUP}>Resistencia Pull-up Interna (Más fácil)</option>
            <option value={TriggerType.PULLDOWN}>Resistencia Pull-down Externa</option>
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !config.pin || !config.key}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading 
              ? 'bg-slate-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-teal-900/50'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando Código...
            </span>
          ) : (
            'Generar Código Arduino'
          )}
        </button>
      </div>
    </div>
  );
};
