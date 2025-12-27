
export enum AppState {
  COUNTDOWN = 'COUNTDOWN',
  FINAL_COUNTDOWN = 'FINAL_COUNTDOWN',
  CAKE_REVEAL = 'CAKE_REVEAL',
  BLOWN = 'BLOWN'
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}
