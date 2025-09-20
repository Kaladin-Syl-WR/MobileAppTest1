import React, { useCallback, useEffect, useReducer } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Pressable, BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { gameReducer, createInitialState } from './src/game/reducer';
import { useGameLoop } from './src/hooks/useGameLoop';
import { GameBoard } from './src/components/GameBoard';
import { ScoreBoard } from './src/components/ScoreBoard';
import { GesturePad } from './src/components/GesturePad';
import { Direction } from './src/types/game';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState());

  useGameLoop(state, dispatch);

  const handleStart = useCallback(() => {
    dispatch({ type: 'START' });
  }, [dispatch]);

  const handleTogglePause = useCallback(() => {
    if (state.status === 'running') {
      dispatch({ type: 'PAUSE' });
    } else if (state.status === 'paused') {
      dispatch({ type: 'RESUME' });
    }
  }, [dispatch, state.status]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleDirectionChange = useCallback((direction: Direction) => {
    dispatch({ type: 'CHANGE_DIRECTION', payload: direction });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const target = typeof window === 'undefined' ? null : window;

    if (!target) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      let nextDirection: Direction | null = null;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          nextDirection = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          nextDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          nextDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          nextDirection = 'RIGHT';
          break;
        default:
          break;
      }

      if (nextDirection) {
        event.preventDefault();
        handleDirectionChange(nextDirection);
      }
    };

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDirectionChange]);

  const handleQuit = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={[styles.quitButton, styles.quitButtonFloating]}
            onPress={handleQuit}
            accessibilityLabel="Quit the app"
          >
            <Text style={styles.quitButtonText}>Quit</Text>
          </Pressable>
          <Text style={styles.title}>Snake</Text>
        </View>
        <GameBoard
          snake={state.snake}
          food={state.food}
          obstacles={state.obstacles}
          status={state.status}
          onRequestResume={handleTogglePause}
        />
        <ScoreBoard
          score={state.score}
          highScore={state.highScore}
          status={state.status}
          onStart={handleStart}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
        />
        {(state.status === 'running' || state.status === 'paused') && (
          <GesturePad status={state.status} onSwipe={handleDirectionChange} />
        )}
        {!(state.status === 'running' || state.status === 'paused') && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tap Start to begin. When the game is running, swipe inside the control zone to steer. Wrap through edges, but avoid your tail and any obstacles!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617'
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    position: 'relative'
  },
  quitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#f87171',
    backgroundColor: 'rgba(248, 113, 113, 0.15)'
  },
  quitButtonFloating: {
    position: 'absolute',
    left: 0,
    top: 8
  },
  quitButtonText: {
    color: '#fda4af',
    fontSize: 14,
    fontWeight: '700'
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#38bdf8'
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  footerText: {
    color: '#94a3b8',
    textAlign: 'center'
  }
});
