import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Board } from './src/components/Board';
import { Controls } from './src/components/Controls';
import { DifficultyPicker } from './src/components/DifficultyPicker';
import { EndGameModal } from './src/components/EndGameModal';
import { NumberPad } from './src/components/NumberPad';
import { TopBar } from './src/components/TopBar';
import { DIFFICULTY_LABELS } from './src/sudoku/types';
import { useSudoku } from './src/sudoku/useSudoku';
import { colors } from './src/theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 420);

export default function App() {
  const { state, conflicts, actions, maxMistakes } = useSudoku('medium');
  const [pendingDifficulty, setPendingDifficulty] = useState(state.difficulty);

  const handleDifficultySelect = (difficulty: typeof state.difficulty) => {
    setPendingDifficulty(difficulty);
    actions.newGame(difficulty);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Sudoku</Text>

      <DifficultyPicker selected={pendingDifficulty} onSelect={handleDifficultySelect} />

      <TopBar
        seconds={state.seconds}
        mistakes={state.mistakes}
        maxMistakes={maxMistakes}
        difficultyLabel={DIFFICULTY_LABELS[state.difficulty]}
      />

      <View style={{ opacity: state.isRunning ? 1 : 0.3 }} pointerEvents={state.isRunning ? 'auto' : 'none'}>
        <Board
          board={state.board}
          given={state.given}
          notes={state.notes}
          selected={state.selected}
          conflicts={conflicts}
          size={BOARD_SIZE}
          onSelect={actions.selectCell}
        />
      </View>

      {!state.isRunning && !state.isWon && !state.isLost && (
        <View style={styles.pausedOverlay}>
          <Text style={styles.pausedText}>Paused</Text>
        </View>
      )}

      <View style={styles.controlsWrapper}>
        <Controls
          isNotesMode={state.isNotesMode}
          hintsLeft={state.hintsLeft}
          isRunning={state.isRunning}
          onToggleNotes={actions.toggleNotesMode}
          onErase={actions.erase}
          onHint={actions.useHint}
          onTogglePause={actions.togglePause}
        />
        <NumberPad board={state.board} onPress={actions.inputNumber} />
      </View>

      <EndGameModal
        visible={state.isWon || state.isLost}
        isWon={state.isWon}
        seconds={state.seconds}
        onNewGame={() => actions.newGame(pendingDifficulty)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textGiven,
    marginBottom: 12,
  },
  controlsWrapper: {
    width: '100%',
    maxWidth: 420,
    marginTop: 20,
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pausedText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textGiven,
  },
});
