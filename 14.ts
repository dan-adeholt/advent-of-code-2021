import { orderBy, values, keys, flatMap, uniq, entries, fromPairs, last, first } from 'lodash-es';
import { readLines } from './loadData';

export const runPolymerIterations = (numIterations: number) => {
  const lines = readLines('14.txt');
  const polymer = lines[0];
  const rules: { [key: string]: string } = fromPairs(lines.slice(1).map((line) => line.split(' -> ')));
  const characters = uniq(flatMap(keys(rules), (rule) => rule.split('')));
  const combinations = uniq(flatMap(keys(rules)));
  const characterCount = fromPairs(characters.map((character) => [character, 0]));
  let activeCombinations = fromPairs(combinations.map((combination) => ([combination, 0])));

  polymer.split('').forEach((character) => characterCount[character]++);

  for (let i = 0; i < polymer.length - 1; i++) {
    activeCombinations[polymer.slice(i, i + 2)]++;
  }

  for (let iteration = 0; iteration < numIterations; iteration++) {
    const newActiveCombinations = fromPairs(combinations.map((combination) => ([combination, 0])));

    for (const [combination, activeCount] of entries(activeCombinations)) {
      const charToInsert = rules[combination];
      characterCount[charToInsert] += activeCount;
      newActiveCombinations[combination[0] + charToInsert] += activeCount;
      newActiveCombinations[charToInsert + combination[1]] += activeCount;
    }

    activeCombinations = newActiveCombinations;
  }

  const rankedOccurrences: number[] = orderBy(values(characterCount));

  return last(rankedOccurrences) - first(rankedOccurrences);
};

export const problem1 = () => runPolymerIterations(10);
export const problem2 = () => runPolymerIterations(40);
