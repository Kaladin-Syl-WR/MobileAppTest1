export const GRID_SIZE = 20; // Number of rows/columns
export const INITIAL_SNAKE_LENGTH = 4;
export const INITIAL_SPEED = 180; // milliseconds between ticks
export const MIN_SPEED = 80;
export const SPEED_STEP = 2;

export interface PhaseObstacleConfig {
  size: number;
  count?: number;
}

export interface PhaseConfig {
  id: number;
  startScore: number;
  obstacles?: PhaseObstacleConfig[];
  speedBoost?: number;
  speedStepBonus?: number;
}

export const GAME_PHASES: PhaseConfig[] = [
  { id: 1, startScore: 0 },
  { id: 2, startScore: 100, obstacles: [{ size: 2 }] },
  { id: 3, startScore: 150, obstacles: [{ size: 2 }] },
  { id: 4, startScore: 200, obstacles: [{ size: 3 }] },
  { id: 5, startScore: 250, obstacles: [{ size: 3 }] },
  { id: 6, startScore: 300, obstacles: [{ size: 2, count: 2 }], speedBoost: 4 },
  { id: 7, startScore: 350, obstacles: [{ size: 4 }], speedStepBonus: 1 },
  { id: 8, startScore: 400, obstacles: [{ size: 3 }, { size: 2, count: 2 }], speedBoost: 4, speedStepBonus: 1 },
  { id: 9, startScore: 450, obstacles: [{ size: 4 }], speedBoost: 4 },
  { id: 10, startScore: 500, obstacles: [{ size: 3, count: 2 }], speedStepBonus: 1 },
  { id: 11, startScore: 550, obstacles: [{ size: 2, count: 3 }, { size: 4 }], speedBoost: 6 },
  { id: 12, startScore: 600, obstacles: [{ size: 5 }], speedStepBonus: 1, speedBoost: 4 },
  { id: 13, startScore: 650, obstacles: [{ size: 3, count: 3 }], speedBoost: 6, speedStepBonus: 1 },
  { id: 14, startScore: 700, obstacles: [{ size: 4, count: 2 }], speedStepBonus: 1 },
  { id: 15, startScore: 750, obstacles: [{ size: 5 }, { size: 2, count: 4 }], speedBoost: 8, speedStepBonus: 1 }
];
