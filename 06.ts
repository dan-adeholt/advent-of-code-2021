import { parseInt, sumBy } from 'lodash-es';
import { readLines } from './loadData';

const calculateNumberOfFish = (days) => {
  const lines = readLines('6.txt');
  const fishes : number[] = lines[0].split(',').map(parseInt);
  let currentDay: number[] = new Array(9).fill(0);
  let nextDay: number[] = Array.from(currentDay);

  for (const fish of fishes) {
    currentDay[fish]++;
  }

  for (let day = 0; day < days; day++) {
    for (let i = 1; i < currentDay.length; i++) {
      nextDay[i - 1] = currentDay[i];
    }

    nextDay[6] += currentDay[0];
    nextDay[8] = currentDay[0];

    const tmp = currentDay;
    currentDay = nextDay;
    nextDay = tmp;
  }

  return sumBy(currentDay);
};

export const problem1 = () => calculateNumberOfFish(80);
export const problem2 = () => calculateNumberOfFish(256);
