export interface Game {
  players: {
    teamOne: string[];
    teamTwo: string[];
  };
  scores: {
    teamOne: number;
    teamTwo: number;
  };
  inProgress: boolean;
  id?: string;
}
