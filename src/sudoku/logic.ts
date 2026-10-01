import { Board, CellValue, Difficulty, DIFFICULTY_REMOVALS, Position } from './types';

const SIZE = 9;
const BOX = 3;

function shuffledDigits(): number[] {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null as CellValue));
}

/** Returns true if `value` can legally be placed at (row, col) given the board's current state. */
export function isValidPlacement(board: Board, row: number, col: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && board[row][i] === value) return false;
    if (i !== row && board[i][col] === value) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r++) {
    for (let c = boxCol; c < boxCol + BOX; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }
  return true;
}

/** Finds all positions (if any) that conflict with the value currently placed at (row, col). */
export function findConflicts(board: Board, row: number, col: number): Position[] {
  const value = board[row][col];
  if (value == null) return [];
  const conflicts: Position[] = [];
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && board[row][i] === value) conflicts.push({ row, col: i });
    if (i !== row && board[i][col] === value) conflicts.push({ row: i, col });
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r++) {
    for (let c = boxCol; c < boxCol + BOX; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        if (!conflicts.some((p) => p.row === r && p.col === c)) conflicts.push({ row: r, col: c });
      }
    }
  }
  return conflicts;
}

function findEmptyCell(board: Board): Position | null {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] == null) return { row, col };
    }
  }
  return null;
}

/** Fills `board` in place with a complete, randomized, valid solution via backtracking. */
function fillBoard(board: Board): boolean {
  const empty = findEmptyCell(board);
  if (!empty) return true;
  const { row, col } = empty;
  for (const digit of shuffledDigits()) {
    if (isValidPlacement(board, row, col, digit)) {
      board[row][col] = digit;
      if (fillBoard(board)) return true;
      board[row][col] = null;
    }
  }
  return false;
}

export function generateSolvedBoard(): Board {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
}

/** Counts solutions up to `limit`, stopping early once reached (used to verify puzzle uniqueness). */
function countSolutions(board: Board, limit: number): number {
  const empty = findEmptyCell(board);
  if (!empty) return 1;
  const { row, col } = empty;
  let count = 0;
  for (let digit = 1; digit <= 9; digit++) {
    if (isValidPlacement(board, row, col, digit)) {
      board[row][col] = digit;
      count += countSolutions(board, limit - count);
      board[row][col] = null;
      if (count >= limit) break;
    }
  }
  return count;
}

function hasUniqueSolution(board: Board): boolean {
  return countSolutions(cloneBoard(board), 2) === 1;
}

/** Removes cells from a solved board while preserving a unique solution, targeting `removals` empties. */
function carvePuzzle(solved: Board, removals: number): Board {
  const puzzle = cloneBoard(solved);
  const positions: Position[] = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) positions.push({ row, col });
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= removals) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }
  return puzzle;
}

export interface GeneratedPuzzle {
  puzzle: Board;
  solution: Board;
}

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solution = generateSolvedBoard();
  const puzzle = carvePuzzle(solution, DIFFICULTY_REMOVALS[difficulty]);
  return { puzzle, solution };
}

export function isBoardComplete(board: Board, solution: Board): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}
