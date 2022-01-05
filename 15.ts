import { parseInt, compact, last, first, sortedIndexBy, range, flatMap } from 'lodash-es';
import { readLines } from './loadData';

const LINK_OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

type NodeLink = {
  risk: number,
  target: Node
};

type Node = {
  risk: number,
  cost: number,
  links: NodeLink[]
};

const dijkstra = (board: Node[][]) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const node = board[row][col];
      node.links = compact(LINK_OFFSETS.map((offset) => board[row + offset[0]]?.[col + offset[1]]))
        .map((link) => ({
          risk: link.risk,
          target: link,
        }));
    }
  }

  const source = first(first(board));
  const target = last(last(board));

  const unvisited = [source];
  source.cost = 0;

  for (let smallestCost = unvisited[0]; smallestCost !== target; smallestCost = unvisited[0]) {
    // Ideally I would use a priority queue with a heap implementation, but a sorted
    // array was fast enough for this input size
    unvisited.splice(0, 1);

    for (const link of smallestCost.links) {
      const alternateRoute = smallestCost.cost + link.risk;
      if (alternateRoute < link.target.cost) {
        if (link.target.cost !== Number.MAX_VALUE) {
          const rangeStart = sortedIndexBy(unvisited, link.target, 'cost');
          unvisited.splice(unvisited.indexOf(link.target, rangeStart), 1);
        }

        link.target.cost = alternateRoute;

        const insertIndex = sortedIndexBy(unvisited, link.target, 'cost');
        unvisited.splice(insertIndex, 0, link.target);
      }
    }
  }

  return target.cost;
};

export const problem1 = (): number => {
  const lines = readLines('15.txt');

  const board: Node[][] = lines.map((line) => line.split('').map((charDigit) => ({
    risk: parseInt(charDigit),
    cost: Number.MAX_VALUE,
    links: [],
  })));

  return dijkstra(board);
};

export const problem2 = (): number => {
  const lines = readLines('15.txt');

  const incrementDigit = (offset: number) => (digit: number) => ((digit - 1 + offset) % 9) + 1;

  const boardNumbers = lines.map((line) => line.split('').map(parseInt));
  let modBoardNumbers: number[][] = [];

  for (const line of boardNumbers) {
    modBoardNumbers.push(flatMap(range(5), (index) => line.map(incrementDigit(index))));
  }

  modBoardNumbers = flatMap(range(5), (index) => modBoardNumbers.map((line) => line.map(incrementDigit(index))));

  const board: Node[][] = modBoardNumbers.map((line) => line.map((risk) => ({
    risk,
    cost: Number.MAX_VALUE,
    links: [],
  })));

  return dijkstra(board);
};
