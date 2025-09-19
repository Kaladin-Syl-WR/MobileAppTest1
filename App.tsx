import React, { useCallback, useReducer } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { gameReducer, createInitialState } from './src/game/reducer';
import { useGameLoop } from './src/hooks/useGameLoop';
import { GameBoard } from './src/components/GameBoard';
import { ScoreBoard } from './src/components/ScoreBoard';
import { Controls } from './src/components/Controls';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Snake</Text>
        <GameBoard
          snake={state.snake}
          food={state.food}
          status={state.status}
        />
        <ScoreBoard
          score={state.score}
          highScore={state.highScore}
          status={state.status}
          onStart={handleStart}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
        />
        <Controls status={state.status} onChangeDirection={handleDirectionChange} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap Start to begin. Use the arrows to change direction. Avoid walls and your tail!
          </Text>
        </View>
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#38bdf8',
    marginTop: 8
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
