import { parseInt, sumBy } from 'lodash-es';
import { readLines } from './loadData';

const intersectionRange = (range, otherRange) => {
  const minRange = range[0] < otherRange[0] ? range : otherRange;
  const maxRange = minRange === range ? otherRange : range;

  if (maxRange[0] > minRange[1]) {
    return null;
  } if (minRange[1] < maxRange[0]) {
    return null;
  }

  const minX = maxRange[0];
  const endX = Math.min(minRange[1], maxRange[1]);
  return [minX, endX];
};

export const sizeOfBlock = (coords) => {
  const [xRange, yRange, zRange] = coords;
  const dx = xRange[1] - xRange[0] + 1;
  const dy = yRange[1] - yRange[0] + 1;
  const dz = zRange[1] - zRange[0] + 1;
  return dx * dy * dz;
};

export const intersectBoxes = (coords, otherCoords) => {
  const ix = intersectionRange(coords[0], otherCoords[0]);
  const iy = intersectionRange(coords[1], otherCoords[1]);
  const iz = intersectionRange(coords[2], otherCoords[2]);

  if (ix && iy && iz) {
    return [ix, iy, iz];
  }

  return null;
};
export const subtractBox = (targetBox, cutBox) => {
  const intersections = intersectBoxes(targetBox, cutBox);

  if (intersections === null) {
    return [targetBox];
  }

  const parts = [];

  // Roof: Is there more of target box above intersection. Use Z as "up axis"
  if (targetBox[2][0] <= (intersections[2][0]) - 1) {
    const roof = [targetBox[0], targetBox[1], [targetBox[2][0], intersections[2][0] - 1]];
    parts.push(roof);
  }

  // Middle layer: Split targetBox at Z >= ints[0], Z <= ints[1] into at most four parts
  if (targetBox[0][0] <= intersections[0][0] - 1) {
    parts.push([[targetBox[0][0], intersections[0][0] - 1], targetBox[1], intersections[2]]);
  }

  if (intersections[0][1] + 1 <= targetBox[0][1]) {
    parts.push([[intersections[0][1] + 1, targetBox[0][1]], targetBox[1], intersections[2]]);
  }

  if (targetBox[1][0] <= intersections[1][0] - 1) {
    parts.push([intersections[0], [targetBox[1][0], intersections[1][0] - 1], intersections[2]]);
  }

  if (targetBox[1][1] >= intersections[1][1] + 1) {
    parts.push([intersections[0], [intersections[1][1] + 1, targetBox[1][1]], intersections[2]]);
  }

  // Floor: is there more of targetBox below intersection?
  if (targetBox[2][1] >= (intersections[2][1] + 1)) {
    const floor = [targetBox[0], targetBox[1], [intersections[2][1] + 1, targetBox[2][1]]];
    parts.push(floor);
  }

  return parts;
};

export const reboot = (shouldLimit: boolean) => {
  const lines = readLines('22.txt');

  const instructions = [];
  for (const line of lines) {
    const [isOn, coords] = line.split(' ');
    instructions.push([isOn === 'on',
      coords.split(',').map((coordElem) => coordElem.split('=')[1].split('..').map(parseInt))]);
  }

  let blocks = [];
  const limitBlock = [[-50, 50], [-50, 50], [-50, 50]];

  for (const instruction of instructions) {
    const isOn = instruction[0];
    let instructionBlock = instruction[1];

    if (shouldLimit) {
      instructionBlock = intersectBoxes(limitBlock, instructionBlock);
      if (instructionBlock == null) {
        continue;
      }
    }

    if (isOn) {
      let curBlocks = [instructionBlock];

      for (const block of blocks) {
        const nextBlocks = [];

        for (const curBlock of curBlocks) {
          nextBlocks.push(...subtractBox(curBlock, block));
        }

        curBlocks = nextBlocks;
      }

      blocks.push(...curBlocks);
    } else {
      const newBlocks = [];
      for (const block of blocks) {
        newBlocks.push(...subtractBox(block, instructionBlock));
      }

      blocks = newBlocks;
    }
  }

  return sumBy(blocks, sizeOfBlock);
};

export const problem1 = () => reboot(true);
export const problem2 = () => reboot(false);
