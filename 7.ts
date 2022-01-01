import { parseInt, max, min } from 'lodash-es';
import { readLines } from './loadData';

const lines = readLines('7.txt');
const crabPositions = lines[0].split(',').map(parseInt);
const maxCrabPos = max(crabPositions);

export const problem1 = () => {
  const crabCount = new Array(maxCrabPos + 1).fill(0);

  for (const crabPos of crabPositions) {
    for (let i = 0; i < crabCount.length; i++) {
      crabCount[i] += Math.abs(i - crabPos);
    }
  }

  return min(crabCount);
};

export const problem2 = () => {
  const crabCount = new Array(maxCrabPos + 1).fill(0);

  for (const crabPos of crabPositions) {
    for (let i = 0; i < crabCount.length; i++) {
      const dist = Math.abs(i - crabPos);
      // Use triangular numbers instead of linear distance
      crabCount[i] += (dist * (dist + 1)) / 2;
    }
  }

  return min(crabCount);
};
