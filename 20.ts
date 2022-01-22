import { map, sum } from 'lodash-es';
import { readLines } from './loadData';

const characterToInt = (character: string): number => (character === '.' ? 0 : 1);

const extend = (image: number[][], fillNumber: number): number[][] => {
  const lineWidth = image[0].length + 2;

  for (const line of image) {
    line.splice(0, 0, fillNumber);
    line.push(fillNumber);
  }

  image.splice(0, 0, new Array(lineWidth).fill(fillNumber));
  image.push(new Array(lineWidth).fill(fillNumber));

  return image;
};

const numLit = (inputImage: number[][]): number => sum(map(inputImage, (row) => sum(row)));

const enhance = (inputImage: number[][], algorithm: number[], iteration: number): number[][] => {
  let fillNumber = 0;

  if (iteration % 2 === 1 && algorithm[0] === 1) {
    fillNumber = 1;
  }

  const extendedInputImage = extend(inputImage, fillNumber);

  const outputImage: number[][] = [];

  for (let row = 0; row < extendedInputImage.length; row++) {
    const outputRow: number[] = [];

    for (let col = 0; col < extendedInputImage[row].length; col++) {
      let number = 0;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          const bit = extendedInputImage[row + rowOffset]?.[col + colOffset] ?? fillNumber;
          number = (number << 1) | bit;
        }
      }

      outputRow.push(algorithm[number]);
    }

    outputImage.push(outputRow);
  }

  return outputImage;
};

export const enhanceData = (numIterations: number) => {
  const lines = readLines('20.txt', false);

  let readingAlgorithm = true;
  const algorithm: number[] = [];
  let image: number[][] = [];

  for (const line of lines) {
    if (line === '') {
      readingAlgorithm = false;
    } else if (readingAlgorithm) {
      algorithm.push(...map(line, characterToInt));
    } else {
      image.push(map(line, characterToInt));
    }
  }

  for (let i = 0; i < numIterations; i++) {
    image = enhance(image, algorithm, i);
  }

  return numLit(image);
};

export const problem1 = () => enhanceData(2);
export const problem2 = () => enhanceData(50);
