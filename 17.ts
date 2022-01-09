import { maxBy, parseInt } from 'lodash-es';
import { readLines } from './loadData';

const triangularNumber = (n) => (n * (n + 1)) / 2;

const xPosAtIteration = (velX, iteration) => {
  const cappedIteration = Math.min(velX, iteration); // After this X position remains same
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

  // Examine all possible velocities at y = 0, which hit the box?
  for (let velY = -1; velY >= minY; velY--) {
    let curVel = velY;
    let posY = 0;
    let iteration = 0;

    while (posY >= minY) {
      posY += curVel;
      iteration++;
      curVel--;

      if (posY >= minY && posY <= maxY) {
        let peakY = 0;
        let numIterations = 0;

        for (let negZeroVelocity = velY + 1; negZeroVelocity < 0; negZeroVelocity++) {
          peakY -= negZeroVelocity;
          numIterations++;
        }

        yHits.push({ initialVelocity: velY, iteration, peakY: 0 });
        yHits.push({ initialVelocity: -velY - 1, peakY, iteration: numIterations * 2 + 1 + iteration });
      }
    }
  }

  if (returnTotal) {
    const hits = new Set<string>();
    for (const yHit of yHits) {
      for (let velX = 1; velX <= maxX; velX++) {
        const possibleXpos = xPosAtIteration(velX, yHit.iteration);
        if (possibleXpos >= minX && possibleXpos <= maxX) {
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
