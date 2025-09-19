import { useEffect, useRef } from 'react';
import { GameState, GameAction } from '../types/game';

type Dispatch = (action: GameAction) => void;

export const useGameLoop = (state: GameState, dispatch: Dispatch) => {
  const animationFrame = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.status !== 'running') {
      if (animationFrame.current) {
        clearInterval(animationFrame.current);
        animationFrame.current = null;
      }
      return undefined;
    }

    animationFrame.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, state.tickInterval);

    return () => {
      if (animationFrame.current) {
        clearInterval(animationFrame.current);
      }
    };
  }, [state.status, state.tickInterval, dispatch]);
};
