import { parseInt, flatMap } from 'lodash-es';
import { readLines } from './loadData';

const triangularNumber = (n) => (n * (n + 1)) / 2;

const xPosAtIteration = (velX, iteration) => {
  const cappedIteration = Math.min(velX, iteration); // After this X position remains constant
  return velX * cappedIteration - triangularNumber(cappedIteration - 1);
};

export const calculateHits = (returnTotal: boolean) => {
  const range = flatMap(readLines('17.txt')[0]
    .split('x=')[1]
    .split(', y=')
    .map((innerRange) => innerRange
      .split('..')
      .map(parseInt)));

  const [minX, maxX, minY, maxY] = range;
  let totalMaxPeakY = 0;
  let hitCount = 0;

  // Find all y velocities that overlap with the box
  // Every initialVelY > 0 will arrive back at y = 0 with velY = -(initialVelY + 1), so no velocity
  // larger than -minY - 1 has a chance of hitting the box since they will overshoot it.
  const compatibleXVelocities: boolean[] = new Array(maxX + 1);

  for (let velY = -minY - 1; velY >= minY; velY--) {
    compatibleXVelocities.fill(false);
    for (let iteration = 0, curVel = velY, posY = 0, peakY = 0; posY >= minY; iteration++) {
      if (posY >= minY && posY <= maxY) {
        totalMaxPeakY = Math.max(totalMaxPeakY, peakY);

        for (let velX = 1; velX <= maxX; velX++) {
          const potentialXpos = xPosAtIteration(velX, iteration);
          if (potentialXpos >= minX && potentialXpos <= maxX && !compatibleXVelocities[velX]) {
            compatibleXVelocities[velX] = true;
            hitCount++;
          }
        }
      }

      peakY = Math.max(peakY, posY);
      posY += curVel--;
    }
  }

  if (returnTotal) {
    return hitCount;
  }

  return totalMaxPeakY;
};

export const problem1 = () => calculateHits(false);
export const problem2 = () => calculateHits(true);
