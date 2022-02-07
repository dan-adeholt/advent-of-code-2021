import { readLines } from './loadData';

const translation = {
  '.': 0,
  '>': 1,
  v: 2,
};

export const problem1 = () => {
  const board = readLines('25.txt');

  let matrix = [];

  for (const line of board) {
    const matrixRow = [];

    for (const character of line) {
      matrixRow.push(translation[character]);
    }

    matrix.push(matrixRow);
  }

  const emptyMatrix = (refMatrix: number[][]) => {
    const retMatrix = [];
    for (let row = 0; row < refMatrix.length; row++) {
      retMatrix.push((new Array(refMatrix[row].length)).fill(0));
    }

    return retMatrix;
  };

  let didMove = true;
  let generation = 0;

  while (didMove) {
    didMove = false;

    let newMatrix = emptyMatrix(matrix);

    for (let row = 0; row < matrix.length; row++) {
      const matrixRow = matrix[row];

      for (let col = 0; col < matrix[row].length; col++) {
        if (matrixRow[col] === 1) {
          // Can we move right?
          const nextCol = (col + 1) % matrixRow.length;

          if (matrixRow[nextCol] === 0) {
            newMatrix[row][nextCol] = 1;
            didMove = true;
          } else {
            newMatrix[row][col] = 1;
          }
        } else if (matrixRow[col] > 0) {
          newMatrix[row][col] = matrixRow[col];
        }
      }
    }

    matrix = newMatrix;
    newMatrix = emptyMatrix(matrix);

    for (let row = 0; row < matrix.length; row++) {
      const matrixRow = matrix[row];

      for (let col = 0; col < matrixRow.length; col++) {
        if (matrixRow[col] === 2) {
          // Can we move down?
          const nextRow = (row + 1) % matrix.length;

          if (matrix[nextRow][col] === 0) {
            newMatrix[nextRow][col] = 2;
            didMove = true;
          } else {
            newMatrix[row][col] = 2;
          }
        } else if (matrixRow[col] > 0) {
          newMatrix[row][col] = matrixRow[col];
        }
      }
    }

    matrix = newMatrix;
    generation++;
  }

  return generation;
};

export const problem2 = () => 'All done!';
