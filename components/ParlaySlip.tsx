import React from 'react';
import { AIPrediction, MatchData } from '../types';
import { Trophy, AlertCircle, Calculator } from 'lucide-react';

interface ParlaySlipProps {
  predictions: AIPrediction[];
  matches: MatchData[];
}

const ParlaySlip: React.FC<ParlaySlipProps> = ({ predictions, matches }) => {
  // Sort by confidence and take top 3
  const topPicks = [...predictions]
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 3);

  if (topPicks.length === 0) return null;

  // Calculate approximate parlay odds (simplified multiplication)
  // In a real app, we'd need the exact decimal odd of the *selected* outcome.
  // We will simulate the odd based on risk for this MVP.
  const calculateOdd = (pick: AIPrediction) => {
    // Inverse correlation: Higher confidence = lower odds
    const baseOdd = 1 + ((100 - pick.confidenceScore) / 20); 
    return Math.max(1.10, baseOdd);
  };

  const totalOdds = topPicks.reduce((acc, pick) => acc * calculateOdd(pick), 1);
  const potentialWin = (100 * totalOdds).toFixed(2); // Assuming $100 bet

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl border border-indigo-500/50 p-6 shadow-2xl sticky top-4">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-indigo-500/30">
        <Trophy className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold text-white">Parlay del Día MVP</h2>
      </div>

      <div className="space-y-4 mb-6">
        {topPicks.map((pick, idx) => {
          const match = matches.find(m => m.id === pick.matchId);
          return (
            <div key={pick.matchId} className="flex justify-between items-start bg-slate-900/50 p-3 rounded border border-indigo-500/20">
              <div>
                <div className="text-xs text-indigo-300 font-bold mb-1">PICK #{idx + 1}</div>
                <div className="text-sm font-semibold text-white">
                  {match?.homeTeam.name} vs {match?.awayTeam.name}
                </div>
                <div className="text-sm text-emerald-400 font-mono mt-1">
                  {pick.suggestedBet}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Confianza</div>
                <div className="font-bold text-white">{pick.confidenceScore}%</div>
                <div className="text-xs text-indigo-300 mt-1">@{calculateOdd(pick).toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Cuota Total</span>
          <span className="text-2xl font-bold text-white font-mono">{totalOdds.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Apuesta Base (Ejemplo)</span>
          <span className="text-slate-200 font-mono">$100.00</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
          <span className="text-emerald-400 font-bold">Ganancia Potencial</span>
          <span className="text-emerald-400 text-xl font-bold font-mono">${potentialWin}</span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-indigo-200 bg-indigo-950/50 p-3 rounded">
        <Calculator size={14} className="shrink-0 mt-0.5" />
        <p>
          Gestión de Bankroll: Se recomienda apostar no más del <strong>1-3%</strong> de tu bankroll total en este parlay debido a la alta varianza de las combinadas.
        </p>
      </div>
    </div>
  );
};

export default ParlaySlip;