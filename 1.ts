import { map, parseInt } from 'lodash-es';
import { readLines } from './loadData';

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

console.log(numGreater);

numGreater = 0;

let left = numbers[0] + numbers[1] + numbers[2];

for (let i = 0; i < numbers.length - 3; i++) {
  const right = left - numbers[i] + numbers[i + 3];

  if (right > left) {
    numGreater++;
  }

  left = right;
}

console.log(numGreater);
