import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface ControlsProps {
  isNotesMode: boolean;
  hintsLeft: number;
  isRunning: boolean;
  onToggleNotes: () => void;
  onErase: () => void;
  onHint: () => void;
  onTogglePause: () => void;
}

function ControlButton({
  label,
  sublabel,
  active,
  disabled,
  onPress,
}: {
  label: string;
  sublabel?: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, active && styles.buttonActive, disabled && styles.buttonDisabled]}
    >
      <Text style={[styles.buttonLabel, active && styles.buttonLabelActive]}>{label}</Text>
      {sublabel != null && <Text style={styles.buttonSublabel}>{sublabel}</Text>}
    </Pressable>
  );
}

export function Controls({
  isNotesMode,
  hintsLeft,
  isRunning,
  onToggleNotes,
  onErase,
  onHint,
  onTogglePause,
}: ControlsProps) {
  return (
    <View style={styles.row}>
      <ControlButton label={isRunning ? 'Pause' : 'Resume'} onPress={onTogglePause} />
      <ControlButton label="Erase" onPress={onErase} />
      <ControlButton
        label="Notes"
        active={isNotesMode}
        onPress={onToggleNotes}
        sublabel={isNotesMode ? 'On' : 'Off'}
      />
      <ControlButton
        label="Hint"
        sublabel={`${hintsLeft} left`}
        disabled={hintsLeft <= 0}
        onPress={onHint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textGiven,
  },
  buttonLabelActive: {
    color: '#fff',
  },
  buttonSublabel: {
    fontSize: 11,
    color: colors.mutedText,
    marginTop: 2,
  },
});
