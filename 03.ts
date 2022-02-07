import { filter } from 'lodash-es';
import { readLines } from './loadData';

export const problem1 = () => {
  const lines = readLines('3.txt');
  const numBits = lines[0].length;
  const numOnes = new Array(numBits).fill(0);

  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '1') {
        numOnes[i]++;
      }
    }
  }

  let gamma = 0;
  const midPoint = lines.length / 2;

  for (const oneCount of numOnes) {
    gamma <<= 1;
    if (oneCount > midPoint) {
      gamma |= 1;
    }
  }

  const mask = (1 << numBits) - 1;
  const epsilon = mask & ~gamma;

  return gamma * epsilon;
};

export const problem2 = () => {
  const lines = readLines('3.txt');
  const numBits = lines[0].length;

  const searchForValue = (allLines: string[], findMostCommon: boolean) : number => {
    let remainingLines = allLines;

    for (let i = 0; i < numBits && remainingLines.length > 1; i++) {
      const ones = filter(remainingLines, (line) => line[i] === '1');
      const zeroes = filter(remainingLines, (line) => line[i] === '0');

      if (findMostCommon) {
        if (ones.length >= zeroes.length) {
          remainingLines = ones;
        } else {
          remainingLines = zeroes;
        }
      } else if (zeroes.length <= ones.length) {
        remainingLines = zeroes;
      } else {
        remainingLines = ones;
      }
    }

    return parseInt(remainingLines[0], 2);
  };

  const oxygenGeneratorRating = searchForValue(lines, true);
  const cO2ScrubberRating = searchForValue(lines, false);
  return oxygenGeneratorRating * cO2ScrubberRating;
};
