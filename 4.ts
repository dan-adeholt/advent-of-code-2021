import {
  parseInt, some, every, range, flatMap, sum,
} from 'lodash-es';
import { readLines } from './loadData';

type BoardNumber = {
  number: number,
  matched: boolean
};

const findWinningBoard = (findLast : boolean) => {
  const fileLines = readLines('4.txt');
  const numbers = fileLines[0]
    .split(',')
    .map(parseInt);
  const boards : BoardNumber[][][] = [];

  for (let i = 1; i < fileLines.length; i += 5) {
    const board = fileLines.slice(i, i + 5).map((line) => line
      .split(/\s\s*?/)
      .filter((numStr) => numStr !== '')
      .map((numStr : string) : BoardNumber => ({
        number: parseInt(numStr),
        matched: false,
      })));
    boards.push(board);
  }

  const boardHasWon = (board) => {
    const verticalBoard = range(5).map((column) => range(5).map((row) => board[row][column]));

    const oneLineIsComplete = (lines : BoardNumber[][]) => some(lines, (line) => every(line, (lineNumber) => lineNumber.matched));

    return oneLineIsComplete(board) || oneLineIsComplete(verticalBoard);
  };

  const wonBoards = new Set<BoardNumber[][]>();

  for (const number of numbers) {
    for (const board of boards) {
      for (const line of board) {
        for (const boardNumber of line) {
          if (boardNumber.number === number) {
            boardNumber.matched = true;

            if (boardHasWon(board) && !wonBoards.has(board)) {
              wonBoards.add(board);
              const unmarkedNumbers = flatMap(board)
                .filter((num) => !num.matched)
                .map((num) => num.number);

              if (!findLast || (findLast && wonBoards.size === boards.length)) {
                return sum(unmarkedNumbers) * number;
              }
            }
          }
        }
      }
    }
  }

  return 0;
};

export const problem1 = () => findWinningBoard(false);
export const problem2 = () => findWinningBoard(true);
