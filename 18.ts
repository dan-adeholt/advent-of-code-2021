import { findIndex, findLastIndex, isNumber, parseInt } from 'lodash-es';
import { readLines } from './loadData';

export const splitTree = (tokens: (number | string)[], explodeIndex: number, splitIndex: number) => {
  const num = tokens[splitIndex] as number;
  tokens.splice(splitIndex, 1, '[', Math.round((num / 2.0) - 0.25), ',', Math.round((num / 2.0) + 0.25), ']');
};

export const getIndices = (tokens: (number | string)[]): number[] => {
  let depth = 0;
  let explodeIndex = -1;
  let splitIndex = -1;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '[') {
      depth++;
    } else if (tokens[i] === ']') {
      depth--;

      if (depth >= 4 && isNumber(tokens[i - 1]) && isNumber(tokens[i - 3]) && explodeIndex === -1) {
        explodeIndex = i - 4;
      }
    } else if (isNumber(tokens[i]) && tokens[i] >= 10 && splitIndex === -1) {
      splitIndex = i;
    }
  }

  return [explodeIndex, splitIndex];
};

export const parseStringToTokens = (treeString: string): (number | string)[] => {
  const tokens: (number | string)[] = [];
  let numStr = '';

  for (let i = 0; i < treeString.length; i++) {
    if (/[0-9]/.test(treeString[i])) {
      numStr += treeString[i];
    } else {
      if (numStr !== '') {
        tokens.push(parseInt(numStr, 10));
        numStr = '';
      }

      tokens.push(treeString[i]);
    }
  }

  return tokens;
};

export const explodeTree = (tokens: (number | string)[], explodeIndex: number) => {
  const left = tokens[explodeIndex + 1];
  const right = tokens[explodeIndex + 3];
  tokens.splice(explodeIndex, 5, 0);
  // @ts-ignore since index is verified to be number
  tokens[findLastIndex(tokens, isNumber, explodeIndex - 1)] += left;
  // @ts-ignore
  tokens[findIndex(tokens, isNumber, explodeIndex + 1)] += right;
};

export const applyReduction = (tokens: (number | string)[]) => {
  let [explodeIndex, splitIndex] = getIndices(tokens);

  while (explodeIndex !== -1 || splitIndex !== -1) {
    if (explodeIndex !== -1) {
      explodeTree(tokens, explodeIndex);
    } else if (splitIndex !== -1) {
      splitTree(tokens, explodeIndex, splitIndex);
    }

    [explodeIndex, splitIndex] = getIndices(tokens);
  }

  return tokens;
};

export const addLines = (lines: string[]) => {
  let curTokens = parseStringToTokens(lines[0]);

  for (let i = 1; i < lines.length; i++) {
    const addTokens = parseStringToTokens(lines[i]);
    curTokens.splice(0, 0, '[');
    curTokens.push(',');
    curTokens.push(...addTokens);
    curTokens.push(']');
    curTokens = applyReduction(curTokens);
  }

  return curTokens;
};

type NestedTree = number | string | NestedTree[];

export const getMagnitudeArray = (tree: NestedTree) => {
  const leftHandSide = isNumber(tree[0]) ? tree[0] : getMagnitudeArray(tree[0]);
  const rightHandSide = isNumber(tree[1]) ? tree[1] : getMagnitudeArray(tree[1]);

  return leftHandSide * 3 + rightHandSide * 2;
};

export const getMagnitude = (tokens: (number | string)[]) => getMagnitudeArray(JSON.parse(tokens.join('')));
export const problem1 = () => getMagnitude(addLines(readLines('18.txt')));

export const problem2 = () => {
  const lines = readLines('18.txt');

  let maxMagnitude = 0;

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      maxMagnitude = Math.max(maxMagnitude, getMagnitude(addLines([lines[i], lines[j]])));
      maxMagnitude = Math.max(maxMagnitude, getMagnitude(addLines([lines[j], lines[i]])));
    }
  }

  return maxMagnitude;
};
