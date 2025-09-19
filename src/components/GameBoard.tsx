import React, { memo, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { GRID_SIZE } from '../constants/game';
import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  status: 'idle' | 'running' | 'paused' | 'gameover';
}

const BOARD_PADDING = 16;

const GameBoardComponent: React.FC<GameBoardProps> = ({ snake, food, status }) => {
  const { width, height } = useWindowDimensions();

  const { size, cellSize } = useMemo(() => {
    const maxBoardSize = Math.min(width - BOARD_PADDING * 2, height * 0.6);
    const computedCellSize = Math.max(12, Math.floor(maxBoardSize / GRID_SIZE));
    const boardPixelSize = computedCellSize * GRID_SIZE;

    return {
      size: boardPixelSize,
      cellSize: computedCellSize
    };
  }, [width, height]);

  return (
    <View style={[styles.board, { width: size, height: size }]}
      accessibilityLabel={`Game board (${status})`}>
      {status === 'idle' && <View style={styles.overlay} />}
      {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.rowGuide, { top: rowIndex * cellSize }]} />
      ))}
      {Array.from({ length: GRID_SIZE }).map((_, columnIndex) => (
        <View key={`column-${columnIndex}`} style={[styles.columnGuide, { left: columnIndex * cellSize }]} />
      ))}
      {snake.map((segment, index) => (
        <View
          key={`snake-${segment.x}-${segment.y}-${index}`}
          style={[
            styles.snake,
            {
              width: cellSize,
              height: cellSize,
              transform: [
                { translateX: segment.x * cellSize },
                { translateY: segment.y * cellSize }
              ],
              backgroundColor: index === 0 ? '#22c55e' : '#16a34a'
            }
          ]}
        />
      ))}
      <View
        style={[
          styles.food,
          {
            width: cellSize,
            height: cellSize,
            transform: [
              { translateX: food.x * cellSize },
              { translateY: food.y * cellSize }
            ]
          }
        ]}
      />
      {status === 'gameover' && (
        <View style={styles.overlay} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    backgroundColor: '#0f172a',
    borderWidth: 4,
    borderColor: '#22d3ee',
    borderRadius: 12,
    overflow: 'hidden'
  },
  snake: {
    position: 'absolute',
    borderRadius: 6
  },
  food: {
    position: 'absolute',
    backgroundColor: '#ef4444',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#fecaca'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)'
  },
  rowGuide: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.08)'
  },
  columnGuide: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.08)'
  }
});

export const GameBoard = memo(GameBoardComponent);
