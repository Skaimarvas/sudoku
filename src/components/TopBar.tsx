import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface TopBarProps {
  seconds: number;
  mistakes: number;
  maxMistakes: number;
  difficultyLabel: string;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TopBar({ seconds, mistakes, maxMistakes, difficultyLabel }: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>Difficulty</Text>
        <Text style={styles.value}>{difficultyLabel}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{formatTime(seconds)}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>Mistakes</Text>
        <Text style={[styles.value, mistakes > 0 && styles.mistakeValue]}>
          {mistakes}/{maxMistakes}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textGiven,
  },
  mistakeValue: {
    color: colors.error,
  },
});
