import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder, PanResponderGestureState } from 'react-native';
import { Direction, GameStatus } from '../types/game';

interface GesturePadProps {
  status: GameStatus;
  onSwipe: (direction: Direction) => void;
}

const SWIPE_THRESHOLD = 16;

export const GesturePad: React.FC<GesturePadProps> = ({ status, onSwipe }) => {
  const isActive = status === 'running';
  const isPaused = status === 'paused';

  const handleSwipe = useCallback((gestureState: PanResponderGestureState) => {
    if (!isActive) {
      return;
    }

    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) {
      return;
    }

    if (absDx > absDy) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
  }, [isActive, onSwipe]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => isActive,
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      if (!isActive) {
        return false;
      }

      return (
        Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
        Math.abs(gestureState.dy) > SWIPE_THRESHOLD
      );
    },
    onPanResponderRelease: (_evt, gestureState) => {
      handleSwipe(gestureState);
    },
    onPanResponderTerminate: (_evt, gestureState) => {
      handleSwipe(gestureState);
    }
  }), [handleSwipe, isActive]);

  return (
    <View
      style={[
        styles.container,
        isActive && styles.containerActive,
        !isActive && styles.containerInactive
      ]}
      {...panResponder.panHandlers}
      accessibilityLabel={isActive ? 'Swipe here to control the snake' : 'Swipe area disabled'}
    >
      {!isActive && (
        <Text style={styles.label}>
          {isPaused ? 'Paused — resume to keep playing' : 'Press Start to begin'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 120,
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(8, 47, 73, 0.35)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerActive: {
    minHeight: 180,
    borderStyle: 'solid',
    backgroundColor: 'rgba(8, 47, 73, 0.5)'
  },
  containerInactive: {
    opacity: 0.4
  },
  label: {
    color: '#e0f2fe',
    fontSize: 16,
    fontWeight: '600'
  }
});
