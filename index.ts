import * as day1 from './1';
import * as day2 from './2';
import * as day3 from './3';
import * as day4 from './4';
import * as day5 from './5';

type Day = {
  problem1: () => number,
  problem2: () => number,
};

const allDays : Day[] = [day1, day2, day3, day4, day5];

allDays.forEach((day, dayIndex) => {
  console.log(`Day ${dayIndex + 1} problem 1: ${day.problem1()}`);
  console.log(`Day ${dayIndex + 1} problem 2: ${day.problem2()}`);
});