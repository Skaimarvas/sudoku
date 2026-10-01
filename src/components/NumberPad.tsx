import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Board } from '../sudoku/types';

interface NumberPadProps {
  board: Board;
  onPress: (value: number) => void;
}

/** Counts how many times each digit 1-9 already appears on the board, so fully-placed digits can be dimmed. */
function useRemainingCounts(board: Board) {
  return useMemo(() => {
    const counts = new Array(10).fill(0);
    for (const row of board) {
      for (const value of row) {
        if (value != null) counts[value]++;
      }
    }
    return counts;
  }, [board]);
}

export function NumberPad({ board, onPress }: NumberPadProps) {
  const counts = useRemainingCounts(board);

  return (
    <View style={styles.row}>
      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
        const used = counts[n] >= 9;
        return (
          <Pressable
            key={n}
            style={[styles.key, used && styles.keyUsed]}
            onPress={() => onPress(n)}
            disabled={used}
          >
            <Text style={[styles.keyText, used && styles.keyTextUsed]}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  key: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  keyUsed: {
    backgroundColor: colors.background,
    borderColor: colors.background,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textGiven,
  },
  keyTextUsed: {
    color: colors.border,
  },
});
