export interface User {
  draws: number;
  goalDifference: number;
  losses: number;
  matchesPlayed: number;
  name: string;
  points: number;
  wins: number;
  id?: string;
  previousGames: string[];
}
