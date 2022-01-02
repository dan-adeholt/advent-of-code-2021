import { flatMap, parseInt } from 'lodash-es';
import { readLines } from './loadData';

const loadMap = (): number[][] => readLines('11.txt')
  .map((line : string) => line
    .split('')
    .map(parseInt));

const visit = (map: number[][], row: number, col: number) => {
  if (map[row]?.[col] === undefined) {
    return;
  }

  map[row][col]++;

  if (map[row][col] === 10) {
    visit(map, row - 1, col);
    visit(map, row + 1, col);
    visit(map, row, col - 1);
    visit(map, row, col + 1);
    visit(map, row - 1, col - 1);
    visit(map, row - 1, col + 1);
    visit(map, row + 1, col - 1);
    visit(map, row + 1, col + 1);
  }
};

const runIteration = (map: number[][]) => {
  let numFlashes = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      visit(map, row, col);
    }
  }

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] >= 10) {
        map[row][col] = 0;
        numFlashes++;
      }
    }
  }

  return numFlashes;
};

export const problem1 = () => {
  const map = loadMap();
  let numFlashes = 0;

  for (let iteration = 0; iteration < 100; iteration++) {
    numFlashes += runIteration(map);
  }

  return numFlashes;
};

export const problem2 = () => {
  const map = loadMap();
  const numOctopuses = flatMap(map).length;
  let allFlashed = false;
  let numIterations = 0;

  while (!allFlashed) {
    if (runIteration(map) === numOctopuses) {
      allFlashed = true;
    }

    numIterations++;
  }

  return numIterations;
};
