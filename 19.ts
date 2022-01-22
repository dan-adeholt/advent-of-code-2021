import { flatMap, parseInt, range, sum, uniqWith } from 'lodash-es';
import { readLines } from './loadData';

const rotationConstants = (steps: number): [number, number] => {
  const rad = Math.PI * 0.5 * steps;
  return [Math.round(Math.cos(rad)), Math.round(Math.sin(rad))];
};

const rotMatrixX = (steps: number): number[][] => {
  const [c, s] = rotationConstants(steps);
  return [
    [1, 0, 0],
    [0, c, -s],
    [0, s, c],
  ];
};

const rotMatrixY = (steps: number): number[][] => {
  const [c, s] = rotationConstants(steps);
  return [
    [c, 0, s],
    [0, 1, 0],
    [-s, 0, c],
  ];
};

const rotMatrixZ = (steps: number): number[][] => {
  const [c, s] = rotationConstants(steps);
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
};

type Rotation = {
  m1: number[][],
  m2: number[][]
};

const rotateAroundZ = (m: number[][]): Rotation[] => range(4).map((i: number): Rotation => ({ m1: m, m2: rotMatrixZ(i) }));

const multiplyMatrixVec = (m: number[][], v: number[]) => (
  [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]]);

const squareVec = (v1: number[]) => v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2];
const addVec = (v1: number[], v2: number[]) => ([v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]);
const subVec = (v1: number[], v2: number[]) => ([v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]);
const isVecEqual = (v1: number[], v2: number[]) => v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
const isVecEqualNeg = (v1: number[], v2: number[]) => v1[0] === -v2[0] && v1[1] === -v2[1] && v1[2] === -v2[2];
const manhattanDist = (v1: number[], v2: number[]) => sum(subVec(v1, v2).map(Math.abs));

const loadScannerData = (): number[][][] => {
  const lines = readLines('19.txt');

  let curPositions = [];
  const scannerData = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('--- scanner')) {
      scannerData.push(curPositions);
      curPositions = [];
    } else if (line !== '') {
      curPositions.push(line.split(',').map(parseInt));
    }
  }

  scannerData.push(curPositions);

  return scannerData;
};

type Scanner = {
  distanceSet: Set<number>,
  squaredDistances: number[],
  squaredPositions: number[][],
  positions: number[][],
  variations: number[][][],
  added: boolean;
};

export const processScanners = () => {
  const scannerPositionData = loadScannerData();

  // Rotate like a die = 6 possible ways a digit can be on top
  // and 4 ways to rotate that digit around the up axis.
  const matrices = [
    ...flatMap(range(4), (i) => rotateAroundZ(rotMatrixY(i))),
    ...rotateAroundZ(rotMatrixX(1)),
    ...rotateAroundZ(rotMatrixX(-1)),
  ];

  const allScanners: Scanner[] = scannerPositionData.map((positions) => {
    const squaredDistances: number[] = [];
    const squaredPositions: number[][] = [];

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        squaredDistances.push(squareVec(subVec(positions[i], positions[j])));
        squaredPositions.push([i, j]);
      }
    }

    return {
      distanceSet: new Set<number>(squaredDistances),
      squaredDistances,
      squaredPositions,
      positions,
      variations: matrices.map(({ m1, m2 }) => positions.map((point) => multiplyMatrixVec(m2, multiplyMatrixVec(m1, point)))),
      added: false,
    };
  });

  allScanners[0].added = true;

  let curScanners = [allScanners[0]];
  const allPositions = [...scannerPositionData[0]];
  const allScannerPositions: number[][] = [];
  while (curScanners.length > 0) {
    const nextScanners = [];
    for (const curScanner of curScanners) {
      for (const otherScanner of allScanners) {
        if (otherScanner.added) {
          continue;
        }

        let sameCount = 0;
        let someDiff = 0;

        otherScanner.squaredDistances.forEach((sqDist) => {
          if (curScanner.distanceSet.has(sqDist)) {
            sameCount++;
            someDiff = sqDist;
          }
        });

        if (sameCount >= 66) {
          // Find index to structure with indices to points that was used in
          // calculating the diff that exists in both scanners
          const i1 = curScanner.squaredDistances.indexOf(someDiff);
          const i2 = otherScanner.squaredDistances.indexOf(someDiff);

          // Then, extract those indices from the structure
          const [curScannerP0Index, curScannerP1Index] = curScanner.squaredPositions[i1];
          const [otherScannerP0Index, otherScannerP1Index] = otherScanner.squaredPositions[i2];

          // Finally, extract the positions from the positions array
          const curScannerFrom = curScanner.positions[curScannerP0Index];
          const curScannerTo = curScanner.positions[curScannerP1Index];

          // Create vector between those two points
          const curScannerVec = subVec(curScannerTo, curScannerFrom);

          // Then, go through all possible rotations to find a rotation where
          // the corresponding vector from the other scanner is equal to the
          // vector from the current scanner, meaning all components and signs
          // are equal. Also accept a vector which is the negative of the
          // current scanner vector, as the distance could be calculated from
          // two directions.
          for (let variationIndex = 0; variationIndex < otherScanner.variations.length && !otherScanner.added; variationIndex++) {
            const otherScannerFrom = otherScanner.variations[variationIndex][otherScannerP0Index];
            const otherScannerTo = otherScanner.variations[variationIndex][otherScannerP1Index];
            const otherScannerVec = subVec(otherScannerTo, otherScannerFrom);

            if (isVecEqual(curScannerVec, otherScannerVec) || isVecEqualNeg(curScannerVec, otherScannerVec)) {
              let tDelta = subVec(curScannerFrom, otherScannerFrom);

              // If the signs are flipped (isVecEqualNeg) from/to should be swapped in the other scanner
              if (otherScannerVec[0] === -curScannerVec[0]) {
                tDelta = subVec(curScannerTo, otherScannerFrom);
              }

              allScannerPositions.push(tDelta);
              // Construct copy of the current scanner but with coordinates in the same orientation
              // as scanner 0. Use that in next iteration.
              const newPositions = otherScanner.variations[variationIndex].map((pos) => addVec(pos, tDelta));

              allPositions.push(...newPositions);

              nextScanners.push({
                ...otherScanner,
                positions: newPositions,
              });

              otherScanner.added = true;
            }
          }
        }
      }
    }

    curScanners = nextScanners;
  }

  let maxSum = 0;
  for (let i = 0; i < allScannerPositions.length; i++) {
    for (let j = i + 1; j < allScannerPositions.length; j++) {
      maxSum = Math.max(maxSum, manhattanDist(allScannerPositions[i], allScannerPositions[j]));
    }
  }

  return [uniqWith(allPositions, isVecEqual).length, maxSum];
};

export const problem1 = () => processScanners()[0];
export const problem2 = () => processScanners()[1];
