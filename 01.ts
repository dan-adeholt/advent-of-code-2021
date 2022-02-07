import { map, parseInt } from 'lodash-es';
import { readLines } from './loadData';

export const problem1 = () => {
  const lines = readLines('1.txt');
  const numbers = map(lines, parseInt);

  let prev = numbers[0];
  let numGreater = 0;

  for (const number of numbers) {
    if (number > prev) {
      numGreater++;
    }

    prev = number;
  }

  return numGreater;
};

export const problem2 = () => {
  const lines = readLines('1.txt');
  const numbers = map(lines, parseInt);

  let numGreater = 0;

  let left = numbers[0] + numbers[1] + numbers[2];

  for (let i = 0; i < numbers.length - 3; i++) {
    const right = left - numbers[i] + numbers[i + 3];

    if (right > left) {
      numGreater++;
    }

    left = right;
  }

  return numGreater;
};
