import { orderBy } from 'lodash-es';
import { readLines } from './loadData';

const lines = readLines('10.txt');

const OPENING_CHARS = ['(', '[', '{', '<'];
const CLOSING_CHARS = [')', ']', '}', '>'];
const PENALTY_TABLE = [3, 57, 1197, 25137];
const COMPLETION_TABLE = [1, 2, 3, 4];

export const processLines = (calculateAutoComplete: boolean) => {
  let penaltySum = 0;
  let completionScores = [];

  for (const line of lines) {
    const openStack = [];
    let corrupted = false;

    for (let i = 0; i < line.length && !corrupted; i++) {
      const character = line[i];
      const openingIndex = OPENING_CHARS.indexOf(character);
      const closingIndex = CLOSING_CHARS.indexOf(character);

      if (openingIndex !== -1) {
        openStack.push(openingIndex);
      } else if (closingIndex !== -1 && openStack.pop() !== closingIndex) {
        penaltySum += PENALTY_TABLE[closingIndex];
        corrupted = true;
      }
    }

    if (!corrupted) {
      completionScores.push(
        openStack
          .reverse()
          .reduce((sum: number, index: number) => sum * 5 + COMPLETION_TABLE[index], 0),
      );
    }
  }

  if (calculateAutoComplete) {
    completionScores = orderBy(completionScores);
    return completionScores[Math.floor(completionScores.length / 2)];
  }

  return penaltySum;
};

export const problem1 = () => processLines(false);
export const problem2 = () => processLines(true);
