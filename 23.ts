import { readLines } from './loadData';

const podToIndex = {
  '.': 0, A: 1, B: 2, C: 3, D: 4,
};
const burrowIndices = [2, 4, 6, 8];
const isBurrowIndex = (i) => i === 2 || i === 4 || i === 6 || i === 8;
const costs = [0, 1, 10, 100, 1000];

const minRemainingCost = (hallway: number[]): number => {
  let minCost = 0;

  for (let i = 0; i < hallway.length; i++) {
    const pod = hallway[i];
    const pods = [pod & 0b111, (pod >> 3) & 0b111, (pod >> 6) & 0b111, (pod >> 9) & 0b111];

    for (let j = 0; j < pods.length; j++) {
      const nestedPod = pods[j];

      if (nestedPod !== 0) {
        const targetBurrowIndex = burrowIndices[nestedPod - 1];
        if (targetBurrowIndex !== i) {
          minCost += Math.abs(targetBurrowIndex - i) * costs[nestedPod];
          minCost += costs[nestedPod];

          if (isBurrowIndex(i)) {
            minCost += costs[nestedPod] * j;
          }
        }
      }
    }
  }

  return minCost;
};

const checkFreePath = (hallway: number[], podPosition: number, start: number, end: number): boolean => {
  for (let j = start; j <= end; j++) {
    if (j !== podPosition && hallway[j] !== 0 && !isBurrowIndex(j)) {
      return false;
    }
  }

  return true;
};

const isBurrowValid = (burrow: number, expectedPod1: number, expectedPod2: number = expectedPod1): boolean => {
  for (let pods = burrow; pods !== 0; pods >>= 3) {
    const curValue = (pods & 0b111);

    if (curValue !== expectedPod1 && curValue !== expectedPod2) {
      return false;
    }
  }

  return true;
};

const everythingInPlace = (hallway: number[]): boolean => {
  let curBurrowPod = 1;
  for (let i = 0; i < hallway.length; i++) {
    if (isBurrowIndex(i)) {
      if (!isBurrowValid(hallway[i], curBurrowPod)) {
        return false;
      }

      curBurrowPod++;
    } else if (hallway[i] !== 0) {
      return false;
    }
  }

  return true;
};

const pushToBurrow = (hallway: number[], burrowTarget: number, pod: number, doubleBurrows: boolean): number => {
  let mask = doubleBurrows ? 0b111000000000 : 0b111000;
  let offsetToSlot = doubleBurrows ? 3 : 1;

  while ((mask & hallway[burrowTarget]) !== 0) {
    mask >>= 3;
    offsetToSlot--;
  }

  hallway[burrowTarget] = (hallway[burrowTarget] & ~mask) | (pod << (3 * offsetToSlot));

  // Return distance from hallway to slot where pod was inserted
  return offsetToSlot + 1;
};

const popBurrow = (burrow: number): [number, number, number, number] => {
  let burrowMask = 0b111;
  let popItem = burrow;
  let distanceToHallway = 1;

  while ((popItem & 0b111) === 0) {
    distanceToHallway++;
    popItem >>= 3;
    burrowMask <<= 3;
  }

  return [popItem & 0b111, burrow & ~burrowMask, distanceToHallway, popItem];
};

const movePodsToBurrows = (hallway: number[], prevCost: number, doubleBurrows: boolean): number => {
  let newCost = prevCost;

  for (let i = 0; i < hallway.length; i++) {
    if (hallway[i] === 0) {
      continue;
    }

    let pod = hallway[i];
    let remainingPods = 0;
    let moveOutDistance = 0;

    if (isBurrowIndex(i)) {
      [pod, remainingPods, moveOutDistance] = popBurrow(pod);
    }

    const burrowTarget = burrowIndices[pod - 1];

    const start = Math.min(burrowTarget, i);
    const end = Math.max(burrowTarget, i);

    if (burrowTarget !== i && isBurrowValid(hallway[burrowTarget], pod, 0) && checkFreePath(hallway, i, start, end)) {
      const dist = (end - start) + moveOutDistance + pushToBurrow(hallway, burrowTarget, pod, doubleBurrows);
      hallway[i] = remainingPods;
      newCost += dist * costs[pod];
      i = -1;
    }
  }

  return newCost;
};

let findMinimalPathInternal;

function movePodsFromBurrowsToHallway(hallway, curCost, cached, curMin: { value: number }, doubleBurrows): number {
  let smallestSum = Number.MAX_VALUE;

  for (let i = 0; i < burrowIndices.length; i++) {
    const burrowIndex = burrowIndices[i];
    const burrowPods = hallway[burrowIndex];

    if (burrowPods === 0) {
      continue;
    }

    const [podToMove, burrowWithoutPod, moveOutDist, burrowTail] = popBurrow(burrowPods);
    const expectedPod = i + 1;

    if (podToMove === expectedPod) {
      // Don't move pod if everything underneath podToMove is also in the correct place
      if (isBurrowValid(burrowTail, expectedPod)) {
        continue;
      }
    }

    let minIndex = burrowIndex - 1;

    for (let j = minIndex; j >= 0 && ((hallway[j] === 0 || isBurrowIndex(j))); j--) {
      minIndex = j;
    }

    for (let j = minIndex; j < hallway.length; j++) {
      if (isBurrowIndex(j)) {
        continue;
      } else if (hallway[j] !== 0) {
        break;
      }

      const newHallway = [...hallway];
      const dist = Math.abs(burrowIndex - j);
      const newCost = curCost + (dist + moveOutDist) * costs[podToMove];
      newHallway[burrowIndex] = burrowWithoutPod;
      newHallway[j] = podToMove;
      smallestSum = Math.min(findMinimalPathInternal(newHallway, newCost, cached, curMin, doubleBurrows), smallestSum);
    }
  }

  return smallestSum;
}

const impossibleToSolve = (hallway: number[]): boolean => {
  const wedges = [3, 5, 7];

  // Examine wedges between burrows.
  // D:s and A/B:s on the wrong side of each other can block any potential solution.
  return (hallway[wedges[0]] > 2 && (hallway[wedges[1]] === 1 || hallway[wedges[2]] === 1))
    || (hallway[wedges[1]] === 4 && hallway[wedges[2]] <= 2);
};

type CurMinState = {
  value: number
};

findMinimalPathInternal = (hallway: number[], prevCost: number, cached: Map<string, number>, curMin: CurMinState, doubleBurrows: boolean): number => {
  if (prevCost >= curMin.value
    || impossibleToSolve(hallway)
    || minRemainingCost(hallway) + prevCost >= curMin.value) {
    return Number.MAX_VALUE;
  }

  const checksum = [...hallway, prevCost].join('');

  if (cached.has(checksum)) {
    return cached.get(checksum);
  }

  const curCost = movePodsToBurrows(hallway, prevCost, doubleBurrows);

  if (everythingInPlace(hallway)) {
    cached.set(checksum, curCost);
    return curCost;
  } if (curCost >= curMin.value) {
    return Number.MAX_VALUE;
  }

  const smallestTotalCost = movePodsFromBurrowsToHallway(hallway, curCost, cached, curMin, doubleBurrows);
  cached.set(checksum, smallestTotalCost);
  curMin.value = Math.min(smallestTotalCost, curMin.value);
  return smallestTotalCost;
};

const findMinimalPath = (hallway: number[], doubleBurrows: boolean): number => findMinimalPathInternal(hallway, 0, new Map<string, number>(), { value: Number.MAX_VALUE }, doubleBurrows);

const findMinimalPathFromLines = (lines: string[]): number => {
  const hallwayChars = lines[1].slice(1, lines[1].length - 1);
  const initialHallway = hallwayChars.split('').map((hallwayChar) => podToIndex[hallwayChar]);

  for (let i = 2, shiftLevel = 0; i < lines.length - 1; i++, shiftLevel += 3) {
    const burrowLevel = lines[i].replace(/#/g, '').trim();
    initialHallway[burrowIndices[0]] |= (podToIndex[burrowLevel[0]] << shiftLevel);
    initialHallway[burrowIndices[1]] |= (podToIndex[burrowLevel[1]] << shiftLevel);
    initialHallway[burrowIndices[2]] |= (podToIndex[burrowLevel[2]] << shiftLevel);
    initialHallway[burrowIndices[3]] |= (podToIndex[burrowLevel[3]] << shiftLevel);
  }

  return findMinimalPath(initialHallway, lines.length === 7);
};

export const problem1 = () => findMinimalPathFromLines(readLines('23.txt'));

export const problem2 = () => {
  const lines = readLines('23.txt');
  lines.splice(3, 0, '  #D#C#B#A#', '  #D#B#A#C#');
  return findMinimalPathFromLines(lines);
};
