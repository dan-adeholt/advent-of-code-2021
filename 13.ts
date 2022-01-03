import {
  parseInt, flatMap, max, without,
} from 'lodash-es';
import { readLines } from './loadData';

type FoldInstruction = {
  dimension: string,
  value: number
};

export const foldTables = (stopAfterFirst: boolean) => {
  const lines = readLines('13.txt');

  const delimiterIndex = lines.findIndex((line) => line.startsWith('fold')) + 1;
  const coords = lines.slice(0, delimiterIndex - 1).map((line) => line.split(',').map(parseInt));
  const foldInstructions: FoldInstruction[] = lines.slice(delimiterIndex - 1)
    .map((line) => {
      const [dimension, value] = line
        .split('fold along ')[1]
        .split('=');

      return { dimension, value: parseInt(value) };
    });

  const tableLength = max(coords.map((line) => line[0])) + 1;
  const tableHeight = max(coords.map((line) => line[1])) + 1;
  let table: number[][] = new Array(tableHeight);

  for (let y = 0; y < tableHeight; y++) {
    table[y] = new Array(tableLength).fill(0);
  }

  for (const line of coords) {
    const [x, y] = line;
    table[y][x] = 1;
  }

  const mergeTable = (dest, foldedSide) => {
    for (let row = 0; row < foldedSide.length; row++) {
      for (let col = 0; col < foldedSide[row].length; col++) {
        dest[row][col] = Math.max(table[row][col], foldedSide[row][col]);
      }
    }
  };

  for (const foldInstruction of foldInstructions) {
    const { dimension, value } = foldInstruction;

    if (dimension === 'y') {
      const flippedSide = table.slice(value + 1);
      table = table.slice(0, value);
      flippedSide.reverse();
      mergeTable(table, flippedSide);
    } else {
      const flippedSide = new Array(table.length);

      for (let row = 0; row < table.length; row++) {
        flippedSide[row] = table[row].slice(value + 1);
        flippedSide[row].reverse();
        table[row] = table[row].slice(0, value);
      }

      mergeTable(table, flippedSide);
    }

    if (stopAfterFirst) {
      break;
    }
  }

  if (stopAfterFirst) {
    return without(flatMap(table), 0).length;
  }

  return `\n${table.map((line: number[]): string => line.join('')
    .replace(/1/g, '#')
    .replace(/0/g, ' ')).join('\n')}`;
};

export const problem1 = () => foldTables(true);
export const problem2 = () => foldTables(false);
