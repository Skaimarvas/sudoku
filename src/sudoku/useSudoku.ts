import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  cloneBoard,
  findConflicts,
  generatePuzzle,
  isBoardComplete,
} from './logic';
import { Board, Difficulty, NotesBoard, Position } from './types';

const MAX_MISTAKES = 3;
const MAX_HINTS = 3;

function createNotesBoard(): NotesBoard {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));
}

export interface SudokuState {
  board: Board;
  given: boolean[][];
  solution: Board;
  notes: NotesBoard;
  selected: Position | null;
  difficulty: Difficulty;
  isNotesMode: boolean;
  mistakes: number;
  hintsLeft: number;
  seconds: number;
  isRunning: boolean;
  isWon: boolean;
  isLost: boolean;
}

function buildGame(difficulty: Difficulty): SudokuState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  const given = puzzle.map((row) => row.map((v) => v != null));
  return {
    board: cloneBoard(puzzle),
    given,
    solution,
    notes: createNotesBoard(),
    selected: null,
    difficulty,
    isNotesMode: false,
    mistakes: 0,
    hintsLeft: MAX_HINTS,
    seconds: 0,
    isRunning: true,
    isWon: false,
    isLost: false,
  };
}

export function useSudoku(initialDifficulty: Difficulty = 'medium') {
  const [state, setState] = useState<SudokuState>(() => buildGame(initialDifficulty));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.isRunning && !state.isWon && !state.isLost) {
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, seconds: s.seconds + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, state.isWon, state.isLost]);

  const newGame = useCallback((difficulty: Difficulty) => {
    setState(buildGame(difficulty));
  }, []);

  const selectCell = useCallback((pos: Position) => {
    setState((s) => ({ ...s, selected: pos }));
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => ({ ...s, isRunning: !s.isRunning }));
  }, []);

  const toggleNotesMode = useCallback(() => {
    setState((s) => ({ ...s, isNotesMode: !s.isNotesMode }));
  }, []);

  const inputNumber = useCallback((value: number) => {
    setState((s) => {
      if (!s.selected || s.isWon || s.isLost || !s.isRunning) return s;
      const { row, col } = s.selected;
      if (s.given[row][col]) return s;

      if (s.isNotesMode) {
        const notes = s.notes.map((r) => r.map((cellSet) => new Set(cellSet)));
        const cellNotes = notes[row][col];
        if (cellNotes.has(value)) cellNotes.delete(value);
        else cellNotes.add(value);
        return { ...s, notes };
      }

      const board = cloneBoard(s.board);
      board[row][col] = value;
      const notes = s.notes.map((r) => r.map((cellSet) => new Set(cellSet)));
      notes[row][col].clear();

      const correct = s.solution[row][col] === value;
      const mistakes = correct ? s.mistakes : s.mistakes + 1;
      const isLost = mistakes >= MAX_MISTAKES;
      const isWon = !isLost && isBoardComplete(board, s.solution);

      return {
        ...s,
        board,
        notes,
        mistakes,
        isLost,
        isWon,
        isRunning: isLost || isWon ? false : s.isRunning,
      };
    });
  }, []);

  const erase = useCallback(() => {
    setState((s) => {
      if (!s.selected || s.isWon || s.isLost) return s;
      const { row, col } = s.selected;
      if (s.given[row][col]) return s;
      const board = cloneBoard(s.board);
      board[row][col] = null;
      const notes = s.notes.map((r) => r.map((cellSet) => new Set(cellSet)));
      notes[row][col].clear();
      return { ...s, board, notes };
    });
  }, []);

  const useHint = useCallback(() => {
    setState((s) => {
      if (!s.selected || s.hintsLeft <= 0 || s.isWon || s.isLost) return s;
      const { row, col } = s.selected;
      if (s.given[row][col] || s.board[row][col] === s.solution[row][col]) return s;
      const board = cloneBoard(s.board);
      board[row][col] = s.solution[row][col];
      const notes = s.notes.map((r) => r.map((cellSet) => new Set(cellSet)));
      notes[row][col].clear();
      const isWon = isBoardComplete(board, s.solution);
      return {
        ...s,
        board,
        notes,
        hintsLeft: s.hintsLeft - 1,
        isWon,
        isRunning: isWon ? false : s.isRunning,
      };
    });
  }, []);

  const conflicts = useMemo(() => {
    if (!state.selected) return [] as Position[];
    return findConflicts(state.board, state.selected.row, state.selected.col);
  }, [state.board, state.selected]);

  return {
    state,
    conflicts,
    actions: {
      newGame,
      selectCell,
      inputNumber,
      erase,
      toggleNotesMode,
      togglePause,
      useHint,
    },
    maxMistakes: MAX_MISTAKES,
  };
}
