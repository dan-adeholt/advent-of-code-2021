import {
  addLines,
  explodeTree, getIndices,
  getMagnitude, parseStringToTokens,
  splitTree,
} from './18';

const printError = (error: string, input: string, expected: string, actual: string) => {
  console.error(error);
  console.error('Input: ', input);
  console.error('Expect:', expected);
  console.error('Actual:', actual);
};

const testSumFromLines = (lineStr: string, expected: string) => {
  const lines = lineStr.split('\n');
  const resultTokens = addLines(lines);
  const resultStr = resultTokens.join('');
  if (resultStr !== expected) {
    printError('Add failed', lineStr, expected, resultStr);
  }
};

const testExplode = (input: string, expected: string) => {
  const tokens = parseStringToTokens(input);
  const [explodeIndex] = getIndices(tokens);
  explodeTree(tokens, explodeIndex);
  const exploded = tokens.join('');

  if (expected !== exploded) {
    printError('Explode test failed', input, expected, exploded);
  }
};

const testMagnitudeLine = (line: string, expected: string) => {
  const tokens = parseStringToTokens(line);
  const magnitude = getMagnitude(tokens);
  if (magnitude !== expected) {
    printError('Magnitude test failed', line, expected, magnitude);
  }
};

const testSplit = (input: string, expected: string) => {
  const tokens = parseStringToTokens(input);
  const [explodeIndex, splitIndex] = getIndices(tokens);

  splitTree(tokens, explodeIndex, splitIndex);
  const splitResult = tokens.join('');

  if (splitResult !== expected) {
    printError('Split test failed', input, expected, splitResult);
  }
};

export const runTestsDay18 = () => {
  testExplode('[[[[[9,8],1],2],3],4]', '[[[[0,9],2],3],4]');
  testExplode('[7,[6,[5,[4,[3,2]]]]]', '[7,[6,[5,[7,0]]]]');
  testExplode('[[6,[5,[4,[3,2]]]],1]', '[[6,[5,[7,0]]],3]');
  testExplode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
  testExplode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[7,0]]]]');
  testExplode('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]', '[[[[0,7],4],[7,[[8,4],9]]],[1,1]]');
  testExplode('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]', '[[[[0,7],4],[15,[0,13]]],[1,1]]');
  testExplode('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]', '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
  testExplode('[[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]', '[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]');
  testExplode('[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]', '[[[[3,0],[5,3]],[4,4]],[5,5]]');
  testExplode('[[[[4,0],[5,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]', '[[[[4,0],[5,4]],[[0,[7,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]');

  testMagnitudeLine('[9,1]', 29);
  testMagnitudeLine('[1,9]', 21);
  testMagnitudeLine('[[9,1],[1,9]]', 129);
  testMagnitudeLine('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488);

  testSplit('[[[[0,7],4],[15,[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]');
  testSplit('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]');

  testSumFromLines('[1,1]\n[2,2]\n[3,3]\n[4,4]', '[[[[1,1],[2,2]],[3,3]],[4,4]]');
  testSumFromLines('[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]', '[[[[3,0],[5,3]],[4,4]],[5,5]]');
  testSumFromLines('[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]\n[6,6]', '[[[[5,0],[7,4]],[5,5]],[6,6]]');

  testSumFromLines('[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]\n[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]', '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]');

  testSumFromLines('[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]\n'
    + '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]\n'
    + '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]\n'
    + '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]\n'
    + '[7,[5,[[3,8],[1,4]]]]\n'
    + '[[2,[2,2]],[8,[8,1]]]\n'
    + '[2,9]\n'
    + '[1,[[[9,3],9],[[9,0],[0,7]]]]\n'
    + '[[[5,[7,4]],7],1]\n'
    + '[[[[4,2],2],6],[8,7]]', '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]');
};
