export interface TeamStats {
  name: string;
  winStreak: number; // Partidos ganados seguidos
  homeAwayPerformance: number; // % de victorias en condición actual (L/V)
  keyInjuries: string[]; // Lista de jugadores clave lesionados
  last5Games: ('W' | 'L' | 'D')[];
}

export interface MatchData {
  id: string;
  sport: 'Fútbol' | 'Baloncesto';
  league: string;
  date: string;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  odds: {
    homeWin: number;
    awayWin: number;
    draw?: number;
  };
}

export interface AIPrediction {
  matchId: string;
  predictedWinner: string;
  confidenceScore: number; // 0-100
  reasoning: string;
  suggestedBet: string; // e.g., "Real Madrid ML" or "Over 2.5 Goals"
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
}

export interface ParlaySuggestion {
  matches: AIPrediction[];
  totalOdds: number;
  potentialPayout: number; // Based on 1 unit bet
  explanation: string;
}