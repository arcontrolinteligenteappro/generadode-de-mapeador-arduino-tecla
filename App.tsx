import React, { useState } from 'react';
import { BoardType, TriggerType, GeneratorConfig, GenerationResponse } from './types';
import { generateArduinoCode } from './services/geminiService';
import { ArduinoForm } from './components/ArduinoForm';
import { CodeBlock } from './components/CodeBlock';
import { Bot, Terminal, AlertTriangle } from 'lucide-react';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [config, setConfig] = useState<GeneratorConfig>({
    board: BoardType.UNO,
    pin: '2',
    key: 'SPACE',
    trigger: TriggerType.PULLUP
  });
  
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await generateArduinoCode(config);
      setResult(response);
    } catch (err: any) {
      setError("Error al conectar con la IA. Por favor verifica tu API Key o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-teal-500/30 relative overflow-hidden">
      
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Image Placeholder - User needs to provide 'background.png' */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 blur-[2px] scale-105 transition-transform duration-[20s] ease-linear"
          style={{ backgroundImage: "url('/background.png')" }}
        />
        {/* Gradient Overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/95 to-[#0f172a]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        {/* Hero Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500/10 p-2 rounded-lg border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Icon icon={Bot} className="text-teal-400" size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 drop-shadow-sm">
                  Arduino KeyMapper AI
                </h1>
                <div className="flex flex-col">
                  <p className="text-xs text-slate-400">Generador de Código Inteligente</p>
                  <a 
                    href="https://www.arcontrolinteligente.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-teal-600/80 hover:text-teal-400 transition-colors mt-0.5 font-medium tracking-wide"
                  >
                    Creado por chrisrey91 | www.arcontrolinteligente.com
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Gemini 2.5 Flash Activo
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8 w-full flex-grow">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <ArduinoForm 
              config={config} 
              onChange={setConfig} 
              onSubmit={handleSubmit}
              isLoading={loading}
            />

            {/* Educational Sidebar Info */}
            <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 p-5 rounded-xl shadow-lg">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Icon icon={Terminal} size={16} />
                ¿Por qué es diferente el UNO?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El Arduino Uno usa un chip conversor USB-Serial separado, lo que impide que la computadora lo reconozca nativamente como un teclado. 
                <br/><br/>
                Para proyectos de teclado real, se recomienda <strong>Arduino Leonardo</strong> o <strong>Pro Micro</strong> (chip ATmega32u4) que tienen soporte USB nativo.
              </p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg flex items-start gap-3 backdrop-blur-sm">
                <Icon icon={AlertTriangle} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error de Generación</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800/60 rounded-xl bg-slate-900/20 backdrop-blur-sm">
                <Icon icon={Terminal} size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Listo para generar tu código</p>
                <p className="text-sm">Configura los parámetros a la izquierda y presiona Generar</p>
              </div>
            )}
            
            {loading && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-24 bg-slate-800/50 rounded-xl"></div>
                 <div className="h-96 bg-slate-800/50 rounded-xl"></div>
               </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in">
                 {/* AI Explanation Card */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/80 backdrop-blur border border-indigo-500/30 p-6 rounded-xl relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Icon icon={Bot} size={100} />
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-3">Instrucciones y Notas</h3>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                     <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {result.explanation}
                     </div>
                  </div>
                </div>

                {/* Code Output */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span className="w-2 h-6 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></span>
                    Código Generado (C++ / .ino)
                  </h3>
                  <CodeBlock code={result.code} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;