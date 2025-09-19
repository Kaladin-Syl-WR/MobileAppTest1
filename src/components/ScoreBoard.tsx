import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GameStatus } from '../types/game';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  status: GameStatus;
  onStart: () => void;
  onTogglePause: () => void;
  onReset: () => void;
}

const formatStatus = (status: GameStatus) => {
  switch (status) {
    case 'running':
      return 'Running';
    case 'paused':
      return 'Paused';
    case 'gameover':
      return 'Game Over';
    default:
      return 'Ready';
  }
};

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  status,
  onStart,
  onTogglePause,
  onReset
}) => {
  const canStart = status === 'idle' || status === 'gameover';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  return (
    <View style={styles.container}>
      <View style={styles.scoresRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Score</Text>
          <Text style={styles.badgeValue}>{score}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Best</Text>
          <Text style={styles.badgeValue}>{highScore}</Text>
        </View>
      </View>
      <Text style={styles.status} accessibilityRole="status">
        {formatStatus(status)}
      </Text>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.primaryButton, !canStart && styles.buttonDisabled]} onPress={onStart} disabled={!canStart}>
          <Text style={styles.buttonText}>{status === 'gameover' ? 'Play Again' : 'Start'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondaryButton, !(isRunning || isPaused) && styles.buttonDisabled]}
          onPress={onTogglePause}
          disabled={!(isRunning || isPaused)}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Resume'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.destructiveButton, status === 'idle' && styles.buttonDisabled]}
          onPress={onReset}
          disabled={status === 'idle'}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    gap: 12
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  badge: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22d3ee',
    alignItems: 'center'
  },
  badgeLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  badgeValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700'
  },
  status: {
    textAlign: 'center',
    color: '#cbd5f5',
    fontSize: 16,
    fontWeight: '600'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700'
  },
  primaryButton: {
    backgroundColor: '#22d3ee'
  },
  secondaryButton: {
    backgroundColor: '#38bdf8'
  },
  destructiveButton: {
    backgroundColor: '#f87171'
  },
  buttonDisabled: {
    opacity: 0.4
  }
});
