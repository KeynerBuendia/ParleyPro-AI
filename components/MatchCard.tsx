import React from 'react';
import { MatchData, AIPrediction } from '../types';
import { Activity, AlertTriangle, TrendingUp, UserX } from 'lucide-react';

interface MatchCardProps {
  match: MatchData;
  prediction?: AIPrediction;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, prediction }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Bajo': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Medio': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'Alto': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-400';
    }
  };

  const getConfidenceBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all">
      {/* Header: League & Time */}
      <div className="flex justify-between items-center mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          {match.sport === 'Fútbol' ? '⚽' : '🏀'} {match.league}
        </span>
        <span>{new Date(match.date).toLocaleDateString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Teams & Odds */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center w-1/3">
          <div className="text-xl font-bold text-white mb-1">{match.homeTeam.name}</div>
          <div className="text-xs text-slate-400">Local ({match.homeTeam.winStreak}W)</div>
          <div className="mt-2 text-sm font-mono text-emerald-400">{match.odds.homeWin}</div>
        </div>
        
        <div className="text-center w-1/3 text-slate-500 text-xs font-bold">
            VS
        </div>

        <div className="text-center w-1/3">
          <div className="text-xl font-bold text-white mb-1">{match.awayTeam.name}</div>
          <div className="text-xs text-slate-400">Visita ({match.awayTeam.winStreak}W)</div>
          <div className="mt-2 text-sm font-mono text-emerald-400">{match.odds.awayWin}</div>
        </div>
      </div>

      {/* Injuries Alert */}
      {(match.homeTeam.keyInjuries.length > 0 || match.awayTeam.keyInjuries.length > 0) && (
        <div className="mb-4 flex items-start gap-2 text-xs text-rose-300 bg-rose-950/30 p-2 rounded">
          <UserX size={14} className="mt-0.5" />
          <div>
            {match.homeTeam.keyInjuries.length > 0 && <span className="block">Bajas {match.homeTeam.name}: {match.homeTeam.keyInjuries.join(', ')}</span>}
            {match.awayTeam.keyInjuries.length > 0 && <span className="block">Bajas {match.awayTeam.name}: {match.awayTeam.keyInjuries.join(', ')}</span>}
          </div>
        </div>
      )}

      {/* AI Analysis Section - Revealed if prediction exists */}
      {prediction ? (
        <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
              <Activity size={16} /> ParlayPro Analysis
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded border ${getRiskColor(prediction.riskLevel)}`}>
              Riesgo {prediction.riskLevel}
            </span>
          </div>
          
          <div className="text-sm text-slate-300 mb-3">
            <span className="text-slate-400">Apuesta Sugerida: </span>
            <span className="font-bold text-white">{prediction.suggestedBet}</span>
          </div>

          <div className="mb-3">
             <div className="flex justify-between text-xs text-slate-400 mb-1">
               <span>Confianza del Modelo</span>
               <span>{prediction.confidenceScore}%</span>
             </div>
             <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${getConfidenceBarColor(prediction.confidenceScore)} transition-all duration-1000`} 
                 style={{ width: `${prediction.confidenceScore}%` }}
               />
             </div>
          </div>

          <p className="text-xs text-slate-400 italic leading-relaxed">
            "{prediction.reasoning}"
          </p>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <span className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <AlertTriangle size={12} /> Esperando análisis...
            </span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;