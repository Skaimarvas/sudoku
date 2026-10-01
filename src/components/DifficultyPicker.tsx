import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Difficulty, DIFFICULTY_LABELS } from '../sudoku/types';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

interface DifficultyPickerProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
  return (
    <View style={styles.row}>
      {DIFFICULTIES.map((d) => {
        const active = d === selected;
        return (
          <Pressable
            key={d}
            onPress={() => onSelect(d)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {DIFFICULTY_LABELS[d]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedText,
  },
  chipTextActive: {
    color: '#fff',
  },
});
