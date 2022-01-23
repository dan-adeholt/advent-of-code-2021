import { parseInt } from 'lodash-es';
import { readLines } from './loadData';

const readPositions = (): number[] => {
  const data = readLines('21.txt');

  const positions = data.map((line) => parseInt(line.split(': ')[1]));
  positions[0]--;
  positions[1]--;
  return positions;
};

export const problem1 = () => {
  const positions = readPositions();
  const score = [0, 0];
  let die = 0;
  const position = (index) => positions[index] + 1;

  let numRolls = 0;

  const roll = () => {
    const ret = die;
    die += 1 % 100;
    numRolls++;
    return ret + 1;
  };

  const move = (index: number, amount: number) => {
    positions[index] = (positions[index] + amount) % 10;
    score[index] += position(index);
  };

  let result = 0;
  while (result === 0) {
    move(0, roll() + roll() + roll());

    if (score[0] >= 1000) {
      result = numRolls * score[1];
      break;
    }

    move(1, roll() + roll() + roll());

    if (score[1] >= 1000) {
      result = numRolls * score[2];
    }
  }

  return result;
};

const getEmptyState = (): number[][][][] => {
  const state = [];
  for (let curPosP0 = 0; curPosP0 < 10; curPosP0++) {
    state.push([]);
    for (let curPosP1 = 0; curPosP1 < 10; curPosP1++) {
      state[curPosP0].push([]);
      for (let curScoreP0 = 0; curScoreP0 <= 20; curScoreP0++) {
        state[curPosP0][curPosP1].push([]);
        for (let curScoreP1 = 0; curScoreP1 <= 20; curScoreP1++) {
          state[curPosP0][curPosP1][curScoreP0].push(0);
        }
      }
    }
  }

  return state;
};

export const problem2 = () => {
  const positions = readPositions();

  const variationCounter: number[] = new Array(10).fill(0);

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        variationCounter[i + j + k]++;
      }
    }
  }

  const variations = [];

  for (let i = 0; i < variationCounter.length; i++) {
    if (variationCounter[i] !== 0) {
      variations.push([i, variationCounter[i]]);
    }
  }

  let state = getEmptyState();

  let numWinsP0 = 0;
  let numWinsP1 = 0;
  let processedIntermediateResult = true;
  let startScore = 0;
  state[positions[0]][positions[1]][0][0] = 1;

  while (processedIntermediateResult) {
    processedIntermediateResult = false;
    const nextState = getEmptyState();
    let minScore = Number.MAX_VALUE;

    for (let curPosP0 = 0; curPosP0 < 10; curPosP0++) {
      for (let curPosP1 = 0; curPosP1 < 10; curPosP1++) {
        for (let curScoreP0 = startScore; curScoreP0 <= 20; curScoreP0++) {
          for (let curScoreP1 = startScore; curScoreP1 <= 20; curScoreP1++) {
            const numAtState = state[curPosP0][curPosP1][curScoreP0][curScoreP1];

            if (numAtState === 0) {
              continue;
            }

            minScore = Math.min(curScoreP0, minScore);
            minScore = Math.min(curScoreP1, minScore);

            processedIntermediateResult = true;

            if (curScoreP1 >= 21 || curScoreP0 >= 21) {
              nextState[curPosP0][curPosP1][curScoreP0][curScoreP1] = numAtState;
            } else {
              variations.forEach(([p0Variation, p0VariationCount]) => {
                const newP0Pos = (curPosP0 + p0Variation) % 10;
                const newP0Score = curScoreP0 + newP0Pos + 1;
                const numCount = numAtState * p0VariationCount;

                if (newP0Score >= 21) {
                  numWinsP0 += numCount;
                } else {
                  for (const variation2 of variations) {
                    const [p1Variation, p1VariationCount] = variation2;
                    const newP1Pos = (curPosP1 + p1Variation) % 10;
                    const newP1Score = curScoreP1 + newP1Pos + 1;

                    if (newP1Score >= 21) {
                      numWinsP1 += numCount * p1VariationCount;
                    } else {
                      nextState[newP0Pos][newP1Pos][newP0Score][newP1Score] += numCount * p1VariationCount;
                    }
                  }
                }
              });
            }
          }
        }
      }
    }

    startScore = minScore;
    state = nextState;
  }

  return Math.max(numWinsP0, numWinsP1);
};
