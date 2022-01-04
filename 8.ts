import { find, uniq, trim, sortBy, lastIndexOf, parseInt } from 'lodash-es';
import { readLines } from './loadData';

const lines = readLines('8.txt');

export const problem1 = () => {
  let totalSum = 0;
  for (const line of lines) {
    const [, outputDigits] = line
      .split(' | ')
      .map((elem) => elem.split(' '));

    for (const digit of outputDigits) {
      const length = digit.length;
      if (length === 2 || length === 3 || length === 4 || length === 7) {
        totalSum++;
      }
    }
  }

  return totalSum;
};

const filteredCombinations = (combinations : string[], filter: string) : string => {
  const trimmed = combinations.map((combination) => trim(combination, filter));
  return find(trimmed, ['length', 1]);
};

const sortStringChars = (str: string) : string => sortBy(uniq(str.split(''))).join('');

export const problem2 = () => {
  let totalSum = 0;
  for (const line of lines) {
    const [combinations, outputDigits] = line
      .split(' | ')
      .map((elem) => elem.split(' '));

    const one = find(combinations, ['length', 2]);
    const seven = find(combinations, ['length', 3]);
    const four = find(combinations, ['length', 4]);
    const eight = find(combinations, ['length', 7]);

    const signalA = trim(seven, one);

    const sevenAndFour = seven + four;

    const signalG = filteredCombinations(combinations, sevenAndFour);
    const signalD = filteredCombinations(combinations, signalA + signalG + one);

    const three = one + signalA + signalG + signalD;
    const nine = three + four;

    const signalE = trim(eight, nine);
    const signalB = trim(eight, three + signalE);
    const signalF = filteredCombinations(combinations, signalA + signalB + signalD + signalG);
    const signalC = filteredCombinations(combinations, signalF);

    const zero = signalA + signalB + signalC + signalE + signalF + signalG;
    const two = signalA + signalC + signalD + signalE + signalG;
    const five = signalA + signalB + signalD + signalF + signalG;
    const six = five + signalE;

    const digitLookup = [zero, one, two, three, four, five, six, seven, eight, nine]
      .map(sortStringChars);

    const findDigit = (scrambledDigit: string) : number => lastIndexOf(digitLookup, sortStringChars(scrambledDigit));

    const outputValues = outputDigits.map(findDigit);
    totalSum += parseInt(outputValues.join(''));
  }

  return totalSum;
};
