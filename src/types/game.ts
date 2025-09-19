export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';

export interface GameState {
  snake: Position[];
  direction: Direction;
  queuedDirection: Direction;
  food: Position;
  status: GameStatus;
  score: number;
  highScore: number;
  tickInterval: number;
}

export interface GameAction {
  type:
    | 'START'
    | 'PAUSE'
    | 'RESUME'
    | 'RESET'
    | 'TICK'
    | 'CHANGE_DIRECTION';
  payload?: any;
}
