import { parseInt, countBy } from 'lodash-es';
import { readLines } from './loadData';

const findOverlaps = (considerDiagonal: boolean) => {
  const lines = readLines('5.txt');

  const occurrences = new Map<string, number>();

  for (const line of lines) {
    const [fromStr, toStr] = line.split(' -> ');
    const from = fromStr.split(',').map(parseInt);
    const to = toStr.split(',').map(parseInt);

    let dist;

    if (from[0] === to[0]) {
      dist = Math.abs(from[1] - to[1]);
    } else if (from[1] === to[1] || considerDiagonal) {
      dist = Math.abs(from[0] - to[0]);
    } else {
      continue;
    }

    const directionVec = [(to[0] - from[0]) / dist, (to[1] - from[1]) / dist];
    const end = [to[0] + directionVec[0], to[1] + directionVec[1]];

    for (let cur = [from[0], from[1]]; cur[0] !== end[0] || cur[1] !== end[1];
      cur[0] += directionVec[0], cur[1] += directionVec[1]) {
      const key = `${cur[0]}-${cur[1]}`;
      occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
    }
  }

  const values = Array.from(occurrences.values());
  const counts = countBy(values, (val) => val > 1);
  return counts.true;
};

const problem1 = () => findOverlaps(false);
const problem2 = () => findOverlaps(true);

console.log(problem1());
console.log(problem2());
