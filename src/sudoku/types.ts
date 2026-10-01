export type CellValue = number | null;

export type Board = CellValue[][]; // 9x9, rows then cols

export type NotesBoard = Set<number>[][]; // pencil marks per cell

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Position {
  row: number;
  col: number;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

// Number of cells (out of 81) removed from the solved board for each difficulty.
export const DIFFICULTY_REMOVALS: Record<Difficulty, number> = {
  easy: 38, // 43 clues remaining
  medium: 46, // 35 clues remaining
  hard: 52, // 29 clues remaining
  expert: 58, // 23 clues remaining
};
