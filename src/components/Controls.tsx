import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Direction, GameStatus } from '../types/game';

interface ControlsProps {
  onChangeDirection: (direction: Direction) => void;
  status: GameStatus;
}

const directions: { label: string; direction: Direction }[] = [
  { label: '↑', direction: 'UP' },
  { label: '↓', direction: 'DOWN' },
  { label: '←', direction: 'LEFT' },
  { label: '→', direction: 'RIGHT' }
];

export const Controls: React.FC<ControlsProps> = ({ onChangeDirection, status }) => {
  const disabled = status !== 'running';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.placeholder} />
        <ControlButton
          label="↑"
          direction="UP"
          disabled={disabled}
          onPress={onChangeDirection}
        />
        <View style={styles.placeholder} />
      </View>
      <View style={styles.row}>
        <ControlButton
          label="←"
          direction="LEFT"
          disabled={disabled}
          onPress={onChangeDirection}
        />
        <View style={styles.placeholder} />
        <ControlButton
          label="→"
          direction="RIGHT"
          disabled={disabled}
          onPress={onChangeDirection}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.placeholder} />
        <ControlButton
          label="↓"
          direction="DOWN"
          disabled={disabled}
          onPress={onChangeDirection}
        />
        <View style={styles.placeholder} />
      </View>
    </View>
  );
};

interface ControlButtonProps {
  label: string;
  direction: Direction;
  disabled: boolean;
  onPress: (direction: Direction) => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({ label, direction, disabled, onPress }) => (
  <Pressable
    style={[styles.button, disabled && styles.buttonDisabled]}
    onPress={() => onPress(direction)}
    disabled={disabled}
  >
    <Text style={styles.buttonLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignSelf: 'stretch',
    gap: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  placeholder: {
    width: 72,
    height: 72
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38bdf8'
  },
  buttonLabel: {
    fontSize: 32,
    color: '#f8fafc',
    fontWeight: '700'
  },
  buttonDisabled: {
    opacity: 0.3
  }
});
