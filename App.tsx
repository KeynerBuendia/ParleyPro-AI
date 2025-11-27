import React, { useState, useEffect, useRef } from 'react';
import { getRealUpcomingMatches, analyzeMatches } from './services/geminiService';
import { MatchData, AIPrediction } from './types';
import MatchCard from './components/MatchCard';
import ParlaySlip from './components/ParlaySlip';
import { BrainCircuit, RefreshCw, AlertOctagon, Satellite, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchLiveMatches();
  }, []);

  const fetchLiveMatches = async () => {
    if (!process.env.API_KEY) {
      setError("Falta la API Key. Por favor configura tu entorno.");
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setError(null);
    try {
      const liveMatches = await getRealUpcomingMatches();
      setMatches(liveMatches);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos en vivo. Verifica tu conexión o intenta más tarde.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Analizamos los datos reales obtenidos
    const results = await analyzeMatches(matches);
    setPredictions(results);
    setAnalyzed(true);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0f172a] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ParlayPro <span className="text-emerald-400">AI</span></span>
            </div>
            <div className="flex items-center gap-3">
               <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                  <Wifi size={12} /> Datos en Vivo
               </span>
               <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || analyzed || matches.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  analyzed || matches.length === 0
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                } disabled:opacity-50`}
              >
                {isAnalyzing ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <BrainCircuit size={18} />
                )}
                {isAnalyzing ? 'Procesando...' : analyzed ? 'Análisis Completo' : 'Analizar Probabilidades'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Banner */}
        {!analyzed && !isAnalyzing && (
          <div className="mb-10 text-center py-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
              Analítica Deportiva en Tiempo Real
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Nuestro motor busca estadísticas reales, cuotas actualizadas y reportes de lesiones en vivo para calcular el valor esperado (EV) de tus apuestas.
            </p>
          </div>
        )}

        {error && (
            <div className="bg-rose-950/50 border border-rose-900 text-rose-300 p-4 rounded-lg text-center mb-8">
                {error}
                <button onClick={fetchLiveMatches} className="ml-4 underline hover:text-rose-100">Reintentar</button>
            </div>
        )}

        {isLoadingData ? (
           <div className="flex flex-col items-center justify-center py-20">
              <Satellite className="text-emerald-500 animate-pulse mb-4" size={48} />
              <h2 className="text-xl text-white font-semibold">Sincronizando con fuentes de datos...</h2>
              <p className="text-slate-500 mt-2 text-sm">Escaneando horarios, cuotas y reportes médicos.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Matches Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Satellite size={18} className="text-emerald-400" />
                  Cartelera Disponible
                </h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                  Fuente: Gemini Search (Live)
                </span>
              </div>
              
              {matches.length === 0 && !error && (
                <div className="text-center py-10 text-slate-500">
                  No se encontraron partidos destacados próximos. Intenta más tarde.
                </div>
              )}

              {matches.map((match) => {
                const prediction = predictions.find(p => p.matchId === match.id);
                return (
                  <MatchCard key={match.id} match={match} prediction={prediction} />
                );
              })}
            </div>

            {/* Sidebar / Parlay Slip */}
            <div className="lg:col-span-1">
              {predictions.length > 0 ? (
                <div className="animate-in slide-in-from-right duration-700">
                  <ParlaySlip predictions={predictions} matches={matches} />
                </div>
              ) : (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 text-center border-dashed sticky top-24">
                  <TrophyIconPlaceholder />
                  <h3 className="text-white font-semibold mt-4">Generador de Parlays</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Una vez cargados los datos reales, ejecuta el análisis para encontrar las mejores combinaciones.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="mt-20 border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-rose-500 font-semibold mb-2">
            <AlertOctagon size={16} />
            <span>Aviso Legal de Responsabilidad</span>
          </div>
          <p className="text-slate-500 text-xs max-w-3xl mx-auto leading-relaxed">
            Esta aplicación utiliza Inteligencia Artificial para analizar datos deportivos públicos en tiempo real. 
            ParlayPro AI no garantiza resultados futuros. Las cuotas mostradas son estimaciones basadas en búsquedas web y pueden variar. 
            Apuesta responsablemente.
          </p>
        </div>
      </footer>
    </div>
  );
};

const TrophyIconPlaceholder = () => (
  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
    <BrainCircuit size={32} />
  </div>
);

export default App;