import { GRID_SIZE, INITIAL_SNAKE_LENGTH, INITIAL_SPEED, MIN_SPEED, SPEED_STEP } from '../constants/game';
import { Direction, GameAction, GameState, Position } from '../types/game';

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

function getNextHead({ x, y }: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { x, y: y - 1 };
    case 'DOWN':
      return { x, y: y + 1 };
    case 'LEFT':
      return { x: x - 1, y };
    case 'RIGHT':
    default:
      return { x: x + 1, y };
  }
}

function isOutOfBounds({ x, y }: Position): boolean {
  return x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE;
}

function hasCollision(snake: Position[], position: Position): boolean {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function randomAvailablePosition(occupied: Position[]): Position {
  const occupiedKey = new Set(occupied.map(pos => `${pos.x}-${pos.y}`));

  while (true) {
    const candidate: Position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    if (!occupiedKey.has(`${candidate.x}-${candidate.y}`)) {
      return candidate;
    }
  }
}

export const createInitialState = (highScore = 0): GameState => {
  const snake = createInitialSnake();
  return {
    snake,
    direction: 'UP',
    queuedDirection: 'UP',
    food: randomAvailablePosition(snake),
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

      if (isOutOfBounds(nextHead) || hasCollision(state.snake, nextHead)) {
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
      const nextInterval = willEatFood
        ? Math.max(MIN_SPEED, state.tickInterval - SPEED_STEP)
        : state.tickInterval;

      return {
        ...state,
        snake: nextSnake,
        direction: nextDirection,
        food: willEatFood ? randomAvailablePosition(nextSnake) : state.food,
        score: nextScore,
        tickInterval: nextInterval
      };
    }
    default:
      return state;
  }
}
