import * as day1 from './1';
import * as day2 from './2';
import * as day3 from './3';
import * as day4 from './4';
import * as day5 from './5';
import * as day6 from './6';
import * as day7 from './7';
import * as day8 from './8';
import * as day9 from './9';
import * as day10 from './10';
import * as day11 from './11';
import * as day12 from './12';
import * as day13 from './13';
import * as day14 from './14';

type Day = {
  problem1: () => number | string,
  problem2: () => number | string,
};
//

const allDays : Day[] = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13, day14];

allDays.forEach((day, dayIndex) => {
  console.log(`Day ${dayIndex + 1} problem 1: ${day.problem1()}`);
  console.log(`Day ${dayIndex + 1} problem 2: ${day.problem2()}`);
});
