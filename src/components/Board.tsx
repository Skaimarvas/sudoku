import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Cell } from './Cell';
import { colors } from '../theme';
import { Board as BoardType, NotesBoard, Position } from '../sudoku/types';

interface BoardProps {
  board: BoardType;
  given: boolean[][];
  notes: NotesBoard;
  selected: Position | null;
  conflicts: Position[];
  size: number;
  onSelect: (pos: Position) => void;
}

export function Board({ board, given, notes, selected, conflicts, size, onSelect }: BoardProps) {
  const cellSize = size / 9;
  const conflictSet = useMemo(
    () => new Set(conflicts.map((p) => `${p.row}-${p.col}`)),
    [conflicts]
  );
  const selectedValue = selected ? board[selected.row][selected.col] : null;

  return (
    <View style={[styles.board, { width: size, height: size }]}>
      {board.map((rowValues, row) => (
        <View key={row} style={styles.row}>
          {rowValues.map((value, col) => {
            const isSelected = selected?.row === row && selected?.col === col;
            const isPeer =
              !!selected &&
              !isSelected &&
              (selected.row === row ||
                selected.col === col ||
                (Math.floor(selected.row / 3) === Math.floor(row / 3) &&
                  Math.floor(selected.col / 3) === Math.floor(col / 3)));
            const isSameValue = !isSelected && selectedValue != null && value === selectedValue;
            const isConflict = conflictSet.has(`${row}-${col}`);
            return (
              <Cell
                key={col}
                value={value}
                notes={notes[row][col]}
                row={row}
                col={col}
                size={cellSize}
                isGiven={given[row][col]}
                isSelected={isSelected}
                isPeer={isPeer}
                isSameValue={isSameValue}
                isConflict={isConflict}
                onPress={() => onSelect({ row, col })}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: colors.gridLineThick,
    backgroundColor: colors.boardBackground,
  },
  row: {
    flexDirection: 'row',
  },
});
