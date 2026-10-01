import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface CellProps {
  value: number | null;
  notes: Set<number>;
  row: number;
  col: number;
  size: number;
  isGiven: boolean;
  isSelected: boolean;
  isPeer: boolean; // same row/col/box as the selected cell
  isSameValue: boolean; // shares the selected cell's value
  isConflict: boolean;
  onPress: () => void;
}

function CellComponent({
  value,
  notes,
  row,
  col,
  size,
  isGiven,
  isSelected,
  isPeer,
  isSameValue,
  isConflict,
  onPress,
}: CellProps) {
  const borderStyles = [
    styles.cell,
    row % 3 === 0 && styles.borderTopThick,
    col % 3 === 0 && styles.borderLeftThick,
    row === 8 && styles.borderBottomThick,
    col === 8 && styles.borderRightThick,
  ];

  let backgroundColor: string = colors.boardBackground;
  if (isSelected) backgroundColor = colors.selected;
  else if (isSameValue && value != null) backgroundColor = colors.sameValue;
  else if (isPeer) backgroundColor = colors.peer;

  return (
    <Pressable
      onPress={onPress}
      style={[borderStyles, { width: size, height: size, backgroundColor }]}
    >
      {value != null ? (
        <Text
          style={[
            styles.value,
            isGiven ? styles.givenValue : styles.enteredValue,
            isConflict && styles.conflictValue,
          ]}
        >
          {value}
        </Text>
      ) : notes.size > 0 ? (
        <View style={styles.notesGrid}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <Text key={n} style={styles.noteText}>
              {notes.has(n) ? n : ''}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.gridLine,
  },
  borderTopThick: { borderTopWidth: 2, borderTopColor: colors.gridLineThick },
  borderLeftThick: { borderLeftWidth: 2, borderLeftColor: colors.gridLineThick },
  borderBottomThick: { borderBottomWidth: 2, borderBottomColor: colors.gridLineThick },
  borderRightThick: { borderRightWidth: 2, borderRightColor: colors.gridLineThick },
  value: {
    fontSize: 22,
    fontWeight: '500',
  },
  givenValue: {
    color: colors.textGiven,
    fontWeight: '700',
  },
  enteredValue: {
    color: colors.textEntered,
  },
  conflictValue: {
    color: colors.error,
  },
  notesGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteText: {
    width: '33.33%',
    height: '33.33%',
    fontSize: 9,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.textNote,
  },
});

function areEqual(prev: CellProps, next: CellProps) {
  return (
    prev.value === next.value &&
    prev.isGiven === next.isGiven &&
    prev.isSelected === next.isSelected &&
    prev.isPeer === next.isPeer &&
    prev.isSameValue === next.isSameValue &&
    prev.isConflict === next.isConflict &&
    prev.size === next.size &&
    prev.notes.size === next.notes.size &&
    Array.from(prev.notes).every((n) => next.notes.has(n))
  );
}

export const Cell = memo(CellComponent, areEqual);
