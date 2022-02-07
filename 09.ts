import { parseInt, orderBy, identity } from 'lodash-es';
import { readLines } from './loadData';

const heightmap = readLines('9.txt')
  .map((line) => line
    .split('')
    .map(parseInt));

const BORDER_HEIGHT = 10;

export const traverseHeightMap = (calculateBasins: boolean) => {
  let sumLowPoints = 0;

  const visitedPoints : boolean[][] = heightmap.map((line) => line.map(() => false));

  // Return 10 as border value around everything since every other
  // value will be smaller than that.
  const readValue = (row: number, col: number): number => heightmap[row]?.[col] ?? BORDER_HEIGHT;

  const visitPoint = (row: number, col: number): number => {
    if (readValue(row, col) === BORDER_HEIGHT || visitedPoints[row][col] || heightmap[row][col] === 9) {
      return 0;
    }

    visitedPoints[row][col] = true;

    return 1
      + visitPoint(row - 1, col) + visitPoint(row + 1, col)
      + visitPoint(row, col + 1) + visitPoint(row, col - 1);
  };

  let basinSizes = [];

  for (let row = 0; row < heightmap.length; row++) {
    for (let col = 0; col < heightmap[row].length; col++) {
      const value = heightmap[row][col];

      const left = readValue(row, col - 1);
      const right = readValue(row, col + 1);
      const top = readValue(row - 1, col);
      const bottom = readValue(row + 1, col);

      if (value < left && value < right && value < top && value < bottom) {
        const basinSize = visitPoint(row, col);
        basinSizes.push(basinSize);
        sumLowPoints += (value + 1);
      }
    }
  }

  basinSizes = orderBy(basinSizes, identity, ['desc']);

  if (calculateBasins) {
    return basinSizes[0] * basinSizes[1] * basinSizes[2];
  }

  return sumLowPoints;
};

export const problem1 = () => traverseHeightMap(false);
export const problem2 = () => traverseHeightMap(true);
