import { readLines } from './loadData';

type Node = {
  name: string,
  isSmall: boolean,
  links: string[]
};

const initializeNodes = () => {
  const lines = readLines('12.txt')
    .map((line) => line.split('-'));

  const nodes : { [key: string]: Node } = {};

  const addNode = (name, otherNode) => {
    const node: Node = nodes[name] ?? {
      name,
      isSmall: name.toLowerCase() === name,
      links: [],
    };

    node.links.push(otherNode);
    nodes[name] = node;
  };

  for (const line of lines) {
    addNode(line[0], line[1]);
    addNode(line[1], line[0]);
  }

  return nodes;
};

export const problem1 = () => {
  const nodes = initializeNodes();

  const findPathSumToEnd = (node, curPath) => {
    if (node.name === 'end') {
      return 1;
    } if (node.isSmall && curPath.includes(node.name)) {
      return 0;
    }
    return node.links.reduce((sum: number, link: any) => sum + findPathSumToEnd(nodes[link], curPath.concat(node.name)), 0);
  };

  return findPathSumToEnd(nodes.start, []);
};

export const problem2 = () => {
  const nodes = initializeNodes();

  const findPathSumToEnd = (node, curPath, hasVisitedSmallCaveTwice) => {
    const nodeIsVisitedSmallCave = node.isSmall && curPath.includes(node.name);

    if (node.name === 'end') {
      return 1;
    } if (nodeIsVisitedSmallCave && (hasVisitedSmallCaveTwice || node.name === 'start')) {
      return 0;
    }

    hasVisitedSmallCaveTwice = hasVisitedSmallCaveTwice || nodeIsVisitedSmallCave;

    return node.links.reduce((sum: number, link: any) => sum + findPathSumToEnd(nodes[link], curPath.concat(node.name), hasVisitedSmallCaveTwice), 0);
  };

  return findPathSumToEnd(nodes.start, [], false);
};
