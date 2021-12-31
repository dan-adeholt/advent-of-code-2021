import { parseInt } from 'lodash-es';
import { readLines } from './loadData';

const lines = readLines('2.txt');
let position = [0, 0];

for (const line of lines) {
  const [command, value] = line.split(' ');

  if (command === 'up') {
    position[0] -= parseInt(value);
  } else if (command === 'down') {
    position[0] += parseInt(value);
  } else if (command === 'forward') {
    position[1] += parseInt(value);
  }
}

console.log(position[0] * position[1]);

let aim = 0;
position = [0, 0];

for (const line of lines) {
  const [command, value] = line.split(' ');

  if (command === 'up') {
    aim -= parseInt(value);
  } else if (command === 'down') {
    aim += parseInt(value);
  } else if (command === 'forward') {
    const x = parseInt(value);
    position[1] += x;
    position[0] += aim * x;
  }
}

console.log(position[0] * position[1]);
