import { GAME_PHASES, GRID_SIZE, INITIAL_SNAKE_LENGTH, INITIAL_SPEED, MIN_SPEED, SPEED_STEP } from '../constants/game';
import { Direction, GameAction, GameState, Obstacle, Position } from '../types/game';

function createInitialSnake(): Position[] {
  const center = Math.floor(GRID_SIZE / 2);
  const snake: Position[] = [];

  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i += 1) {
    snake.push({ x: center, y: center + i });
  }

  return snake;
}

function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

const MAX_UINT32 = 0x100000000;

function positionKey(position: Position): string {
  return `${position.x}-${position.y}`;
}

function flattenObstacles(obstacles: Obstacle[]): Position[] {
  return obstacles.flatMap(obstacle => obstacle.cells);
}

function hitsObstacle(obstacles: Obstacle[], position: Position): boolean {
  return obstacles.some(obstacle =>
    obstacle.cells.some(cell => cell.x === position.x && cell.y === position.y)
  );
}

function getPhaseIndex(score: number): number {
  let resolvedIndex = 0;

  for (let i = 0; i < GAME_PHASES.length; i += 1) {
    if (score >= GAME_PHASES[i].startScore) {
      resolvedIndex = i;
    } else {
      break;
    }
  }

  return resolvedIndex;
}

function addPositionsToSet(target: Set<string>, positions: Position[]): void {
  positions.forEach(position => target.add(positionKey(position)));
}

function randomFloat(): number {
  const crypto = globalThis.crypto;

  if (crypto && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / MAX_UINT32;
  }

  return Math.random();
}

function randomIntInclusive(max: number): number {
  if (max <= 0) {
    return 0;
  }

  return Math.floor(randomFloat() * (max + 1));
}

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomIntInclusive(i);

    if (i !== j) {
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
  }
}

function getSpeedStep(phaseIndex: number): number {
  let step = SPEED_STEP;

  for (let i = 0; i <= phaseIndex && i < GAME_PHASES.length; i += 1) {
    const phase = GAME_PHASES[i];

    if (phase?.speedStepBonus) {
      step += phase.speedStepBonus;
    }
  }

  return step;
}

function addPhaseObstacles(
  phaseIndex: number,
  occupiedKey: Set<string>,
  accumulator: Obstacle[]
): void {
  const phase = GAME_PHASES[phaseIndex];

  if (!phase?.obstacles) {
    return;
  }

  phase.obstacles.forEach(({ size, count = 1 }) => {
    for (let i = 0; i < count; i += 1) {
      const cells = createBlockObstacle(size, occupiedKey);

      if (!cells) {
        break;
      }

      accumulator.push({ cells });
      addPositionsToSet(occupiedKey, cells);
    }
  });
}

function wrapCoordinate(value: number): number {
  if (value < 0) {
    return GRID_SIZE - 1;
  }

  if (value >= GRID_SIZE) {
    return 0;
  }

  return value;
}

function getNextHead({ x, y }: Position, direction: Direction): Position {
  let nextX = x;
  let nextY = y;

  switch (direction) {
    case 'UP':
      nextY -= 1;
      break;
    case 'DOWN':
      nextY += 1;
      break;
    case 'LEFT':
      nextX -= 1;
      break;
    case 'RIGHT':
    default:
      nextX += 1;
      break;
  }

  return {
    x: wrapCoordinate(nextX),
    y: wrapCoordinate(nextY)
  };
}

function hasCollision(snake: Position[], position: Position): boolean {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function randomAvailablePosition(occupied: Position[]): Position {
  const occupiedKey = new Set(occupied.map(positionKey));

  while (true) {
    const candidate: Position = {
      x: randomIntInclusive(GRID_SIZE - 1),
      y: randomIntInclusive(GRID_SIZE - 1)
    };

    if (!occupiedKey.has(positionKey(candidate))) {
      return candidate;
    }
  }
}

function createBlockObstacle(size: number, occupiedKey: Set<string>): Position[] | null {
  if (size <= 0 || size > GRID_SIZE) {
    return null;
  }

  const maxStart = GRID_SIZE - size;

  if (maxStart < 0) {
    return null;
  }

  const candidates: Position[] = [];

  for (let x = 0; x <= maxStart; x += 1) {
    for (let y = 0; y <= maxStart; y += 1) {
      candidates.push({ x, y });
    }
  }

  shuffleInPlace(candidates);

  for (const { x: startX, y: startY } of candidates) {
    const cells: Position[] = [];
    let overlaps = false;

    for (let dx = 0; dx < size && !overlaps; dx += 1) {
      for (let dy = 0; dy < size; dy += 1) {
        const cell = { x: startX + dx, y: startY + dy };

        if (occupiedKey.has(positionKey(cell))) {
          overlaps = true;
          break;
        }

        cells.push(cell);
      }
    }

    if (!overlaps) {
      return cells;
    }
  }

  return null;
}

export const createInitialState = (highScore = 0): GameState => {
  const snake = createInitialSnake();
  const obstacles: Obstacle[] = [];
  const phaseIndex = getPhaseIndex(0);
  return {
    snake,
    direction: 'UP',
    queuedDirection: 'UP',
    food: randomAvailablePosition([...snake, ...flattenObstacles(obstacles)]),
    obstacles,
    phaseIndex,
    status: 'idle',
    score: 0,
    highScore,
    tickInterval: INITIAL_SPEED
  };
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START': {
      return {
        ...createInitialState(state.highScore),
        status: 'running'
      };
    }
    case 'PAUSE': {
      if (state.status !== 'running') {
        return state;
      }

      return { ...state, status: 'paused' };
    }
    case 'RESUME': {
      if (state.status !== 'paused') {
        return state;
      }

      return { ...state, status: 'running' };
    }
    case 'RESET': {
      return createInitialState(state.highScore);
    }
    case 'CHANGE_DIRECTION': {
      const nextDirection: Direction = action.payload;

      if (isOppositeDirection(state.direction, nextDirection) || state.direction === nextDirection) {
        return state;
      }

      return {
        ...state,
        queuedDirection: nextDirection
      };
    }
    case 'TICK': {
      if (state.status !== 'running') {
        return state;
      }

      const nextDirection = state.queuedDirection;
      const nextHead = getNextHead(state.snake[0], nextDirection);

      if (hasCollision(state.snake, nextHead) || hitsObstacle(state.obstacles, nextHead)) {
        const newHighScore = Math.max(state.score, state.highScore);
        return {
          ...state,
          status: 'gameover',
          highScore: newHighScore
        };
      }

      const willEatFood = nextHead.x === state.food.x && nextHead.y === state.food.y;

      const grownSnake = [nextHead, ...state.snake];
      const nextSnake = willEatFood ? grownSnake : grownSnake.slice(0, state.snake.length);

      const nextScore = willEatFood ? state.score + 10 : state.score;
      const nextPhaseIndex = getPhaseIndex(nextScore);
      const speedStep = getSpeedStep(nextPhaseIndex);

      let nextInterval = state.tickInterval;

      if (willEatFood) {
        nextInterval = Math.max(MIN_SPEED, nextInterval - speedStep);
      }

      let nextObstacles = state.obstacles;

      if (nextPhaseIndex > state.phaseIndex) {
        const occupiedKey = new Set<string>();

        addPositionsToSet(occupiedKey, nextSnake);

        if (!willEatFood) {
          addPositionsToSet(occupiedKey, [state.food]);
        }

        state.obstacles.forEach(obstacle => addPositionsToSet(occupiedKey, obstacle.cells));

        const accumulatedObstacles = [...state.obstacles];

        for (let phaseIndex = state.phaseIndex + 1; phaseIndex <= nextPhaseIndex; phaseIndex += 1) {
          addPhaseObstacles(phaseIndex, occupiedKey, accumulatedObstacles);

          const phase = GAME_PHASES[phaseIndex];

          if (phase?.speedBoost) {
            nextInterval = Math.max(MIN_SPEED, nextInterval - phase.speedBoost);
          }
        }

        nextObstacles = accumulatedObstacles;
      }

      const nextFood = willEatFood
        ? randomAvailablePosition([...nextSnake, ...flattenObstacles(nextObstacles)])
        : state.food;

      return {
        ...state,
        snake: nextSnake,
        direction: nextDirection,
        food: nextFood,
        obstacles: nextObstacles,
        phaseIndex: nextPhaseIndex,
        score: nextScore,
        tickInterval: nextInterval
      };
    }
    default:
      return state;
  }
}
