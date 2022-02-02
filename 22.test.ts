import { isEqual } from 'lodash-es';
import { intersectBoxes, subtractBox } from './22';

export const runTestsDay22 = () => {
  const testSubtract = (targetBox, cutBox, expected) => {
    const res = subtractBox(targetBox, cutBox);
    if (!isEqual(res, expected)) {
      console.log('Error when subtracting box');
      console.log('Input : ', targetBox, cutBox);
      console.log('Expect:', expected);
      console.log('Actual:', res);
    }
    const ints = intersectBoxes(targetBox, cutBox);

    if (ints == null) {
      return;
    }

    for (const resBlock of res) {
      const ints2 = intersectBoxes(ints, resBlock);
      if (ints2 != null) {
        console.log('ERROR overlap:', resBlock, ints2);
      }
    }
  };

  const targetBox = [[0, 10], [0, 10], [0, 10]];
  testSubtract(targetBox, [[20, 40], [20, 40], [20, 40]], [targetBox]);
  testSubtract(targetBox, [[-40, -20], [-40, -20], [-40, -20]], [targetBox]);
  testSubtract(targetBox, targetBox, []);
  testSubtract(targetBox, [[-10, 10], [-10, 10], [1, 10]], [[[0, 10], [0, 10], [0, 0]]]);
  testSubtract(targetBox, [[0, 10], [0, 10], [1, 10]], [[[0, 10], [0, 10], [0, 0]]]);
  testSubtract(targetBox, [[0, 10], [0, 10], [10, 10]], [[[0, 10], [0, 10], [0, 9]]]);
  testSubtract(targetBox, [[0, 10], [0, 10], [0, 0]], [[[0, 10], [0, 10], [1, 10]]]);
  testSubtract(targetBox, [[0, 10], [0, 10], [5, 5]], [[[0, 10], [0, 10], [0, 4]], [[0, 10], [0, 10], [6, 10]]]);

  const targetBox2d = [[0, 10], [0, 10], [0, 0]];
  testSubtract(targetBox2d, [[0, 0], [0, 0], [0, 0]], [[[1, 10], [0, 10], [0, 0]], [[0, 0], [1, 10], [0, 0]]]);
  testSubtract(targetBox2d, [[10, 10], [0, 0], [0, 0]], [[[0, 9], [0, 10], [0, 0]], [[10, 10], [1, 10], [0, 0]]]);
  testSubtract(targetBox2d, [[0, 0], [10, 10], [0, 0]], [[[1, 10], [0, 10], [0, 0]], [[0, 0], [0, 9], [0, 0]]]);
  testSubtract(targetBox2d, [[10, 10], [10, 10], [0, 0]], [[[0, 9], [0, 10], [0, 0]], [[10, 10], [0, 9], [0, 0]]]);

  testSubtract(targetBox2d, [[5, 5], [0, 0], [0, 0]], [[[0, 4], [0, 10], [0, 0]], [[6, 10], [0, 10], [0, 0]], [[5, 5], [1, 10], [0, 0]]]);
  testSubtract(targetBox2d, [[0, 0], [5, 5], [0, 0]], [[[1, 10], [0, 10], [0, 0]], [[0, 0], [0, 4], [0, 0]], [[0, 0], [6, 10], [0, 0]]]);
  testSubtract(targetBox2d, [[5, 5], [10, 10], [0, 0]], [[[0, 4], [0, 10], [0, 0]], [[6, 10], [0, 10], [0, 0]], [[5, 5], [0, 9], [0, 0]]]);
  testSubtract(targetBox2d, [[10, 10], [5, 5], [0, 0]], [[[0, 9], [0, 10], [0, 0]], [[10, 10], [0, 4], [0, 0]], [[10, 10], [6, 10], [0, 0]]]);
  testSubtract(targetBox2d, [[5, 5], [5, 5], [0, 0]], [[[0, 4], [0, 10], [0, 0]], [[6, 10], [0, 10], [0, 0]], [[5, 5], [0, 4], [0, 0]], [[5, 5], [6, 10], [0, 0]]]);

  testSubtract(targetBox, [[5, 5], [5, 5], [5, 5]], [[[0, 10], [0, 10], [0, 4]], [[0, 4], [0, 10], [5, 5]], [[6, 10], [0, 10], [5, 5]], [[5, 5], [0, 4], [5, 5]], [[5, 5], [6, 10], [5, 5]], [[0, 10], [0, 10], [6, 10]]]);

  testSubtract([[11, 13], [11, 13], [11, 13]], [[10, 12], [10, 12], [10, 12]], [
    [[13, 13], [11, 13], [11, 12]],
    [[11, 12], [13, 13], [11, 12]],
    [[11, 13], [11, 13], [13, 13]],
  ]);
};
