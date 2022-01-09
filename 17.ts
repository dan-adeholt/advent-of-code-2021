import { maxBy, parseInt } from 'lodash-es';
import { readLines } from './loadData';

const triangularNumber = (n) => (n * (n + 1)) / 2;

const xPosAtIteration = (velX, iteration) => {
  const cappedIteration = Math.min(velX, iteration); // After this X position remains constant
  return velX * cappedIteration - triangularNumber(cappedIteration - 1);
};

type VerticalHit = {
  initialVelocity: number,
  peakY: number,
  iteration: number
};

export const calculateHits = (returnTotal: boolean) => {
  const line = readLines('17.txt')[0];
  const [xRange, yRange] = line
    .split('x=')[1]
    .split(', y=')
    .map((range) => range
      .split('..')
      .map(parseInt));

  const [minX, maxX] = xRange;
  const [minY, maxY] = yRange;

  const yHits: VerticalHit[] = [];

  // Find all y velocities that overlap with the box
  // Every initialVelY > 0 will arrive back at y = 0 with velY = -(initialVelY + 1), so no velocity
  // larger than -minY - 1 has a chance of hitting the box since they will overshoot it.
  for (let velY = -minY - 1; velY >= minY; velY--) {
    for (let iteration = 0, curVel = velY, posY = 0, peakY = 0; posY >= minY; iteration++) {
      if (posY >= minY && posY <= maxY) {
        yHits.push({ initialVelocity: velY, iteration, peakY });
      }

      peakY = Math.max(peakY, posY);
      posY += curVel;
      curVel--;
    }
  }

  if (returnTotal) {
    const hits = new Set<string>();
    // Go through all Y hits, find all X velocities that would also hit the box at the same time.
    for (const yHit of yHits) {
      for (let velX = 1; velX <= maxX; velX++) {
        const potentialXpos = xPosAtIteration(velX, yHit.iteration);
        if (potentialXpos >= minX && potentialXpos <= maxX) {
          hits.add(`${velX},${yHit.initialVelocity}`);
        }
      }
    }

    return hits.size;
  }

  return maxBy(yHits, 'peakY').peakY;
};

export const problem1 = () => calculateHits(false);
export const problem2 = () => calculateHits(true);
