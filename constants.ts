import { MatchData } from './types';

// Simulamos datos que vendrían de una API como 'API-Football' o 'The-Odds-API'
export const MOCK_UPCOMING_MATCHES: MatchData[] = [
  {
    id: 'm1',
    sport: 'Fútbol',
    league: 'La Liga',
    date: '2023-10-28T20:00:00',
    homeTeam: {
      name: 'Barcelona',
      winStreak: 4,
      homeAwayPerformance: 0.85,
      keyInjuries: ['Pedri'],
      last5Games: ['W', 'W', 'W', 'D', 'W']
    },
    awayTeam: {
      name: 'Real Madrid',
      winStreak: 3,
      homeAwayPerformance: 0.70,
      keyInjuries: ['Courtois', 'Alaba'],
      last5Games: ['W', 'W', 'W', 'L', 'W']
    },
    odds: { homeWin: 2.35, awayWin: 2.80, draw: 3.50 }
  },
  {
    id: 'm2',
    sport: 'Fútbol',
    league: 'Premier League',
    date: '2023-10-29T16:30:00',
    homeTeam: {
      name: 'Man City',
      winStreak: 2,
      homeAwayPerformance: 0.90,
      keyInjuries: ['De Bruyne'],
      last5Games: ['W', 'L', 'W', 'W', 'W']
    },
    awayTeam: {
      name: 'Man United',
      winStreak: 2,
      homeAwayPerformance: 0.40,
      keyInjuries: ['Martinez', 'Shaw'],
      last5Games: ['W', 'W', 'L', 'L', 'W']
    },
    odds: { homeWin: 1.30, awayWin: 8.50, draw: 5.50 }
  },
  {
    id: 'm3',
    sport: 'Baloncesto',
    league: 'NBA',
    date: '2023-10-30T19:30:00',
    homeTeam: {
      name: 'Boston Celtics',
      winStreak: 5,
      homeAwayPerformance: 0.80,
      keyInjuries: [],
      last5Games: ['W', 'W', 'W', 'W', 'W']
    },
    awayTeam: {
      name: 'Miami Heat',
      winStreak: 1,
      homeAwayPerformance: 0.45,
      keyInjuries: ['Herro'],
      last5Games: ['L', 'L', 'W', 'L', 'W']
    },
    odds: { homeWin: 1.25, awayWin: 4.10 }
  },
  {
    id: 'm4',
    sport: 'Fútbol',
    league: 'Serie A',
    date: '2023-10-29T20:45:00',
    homeTeam: {
      name: 'Napoli',
      winStreak: 1,
      homeAwayPerformance: 0.60,
      keyInjuries: ['Osimhen'],
      last5Games: ['W', 'L', 'L', 'W', 'D']
    },
    awayTeam: {
      name: 'AC Milan',
      winStreak: 3,
      homeAwayPerformance: 0.75,
      keyInjuries: [],
      last5Games: ['W', 'W', 'L', 'W', 'W']
    },
    odds: { homeWin: 2.50, awayWin: 2.90, draw: 3.20 }
  },
  {
    id: 'm5',
    sport: 'Baloncesto',
    league: 'NBA',
    date: '2023-10-31T20:00:00',
    homeTeam: {
      name: 'Lakers',
      winStreak: 0,
      homeAwayPerformance: 0.65,
      keyInjuries: ['Vanderbilt'],
      last5Games: ['L', 'W', 'L', 'W', 'L']
    },
    awayTeam: {
      name: 'Suns',
      winStreak: 2,
      homeAwayPerformance: 0.60,
      keyInjuries: ['Booker', 'Beal'],
      last5Games: ['W', 'W', 'L', 'W', 'L']
    },
    odds: { homeWin: 1.80, awayWin: 2.05 }
  }
];