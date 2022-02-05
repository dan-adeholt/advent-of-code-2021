import { parseInt } from 'lodash-es';
import { readLines } from './loadData';

const loadVerificationAlgorithm = () => {
  const lines = readLines('24.txt');

  let program = '';
  program += 'let w = 0;\n';
  program += 'let x = 0;\n';
  program += 'let y = 0;\n';
  program += 'let z = 0;\n\n';
  program += 'const modulo = (a, n) => ((a % n ) + n ) % n;\n\n';

  let curDigit = 0;

  const expression = (code) => {
    program += `${code};\n`;
  };

  for (const line of lines) {
    const [command, target, value] = line.split(' ');

    if (command === 'inp') {
      expression(`${target} = digits[${curDigit++}]`);
    } else if (command === 'add') {
      expression(`${target} = ${target} + ${value}`);
    } else if (command === 'mul') {
      expression(`${target} = ${target} * ${value}`);
    } else if (command === 'div') {
      expression(`${target} = Math.trunc(${target} / ${value})`);
    } else if (command === 'mod') {
      expression(`${target} = ${target} % ${value}`);
    } else if (command === 'eql') {
      expression(`${target} = ${target} === ${value} ? 1 : 0`);
    }
  }

  expression('return z === 0;');

  return new Function('digits', program);
};

// By analyzing the program I figured out that the algorithm uses z as a stack
// where each entry can be at most 26. Each step is either a push or a pop of
// the stack, and when a pop occurs it examines the value popped compared to
// the current digit. It must match with an offset, otherwise no pop occurs and
// the top of the stack is simply replaced by another value. All pops must be
// successful for Z to be zero at the end. Each push will push the current digit
// with some offset. By subtracting the compare offset at the pop with the push
// offset I get one offset. Each constraint basically means "This digit at index
// X should be equal to the digit at index Y with the specified offset)".
type Constraint = {
  index: number,
  relativeIndex: number,
  offset: number
};

const createConstraint = (index, relativeIndex, offset) => ({ index, relativeIndex, offset });

const constraints: Constraint[] = [
  createConstraint(13, 0, 0),
  createConstraint(12, 1, 5),
  createConstraint(11, 2, -8),
  createConstraint(5, 4, 7),
  createConstraint(7, 6, -7),
  createConstraint(8, 3, -2),
  createConstraint(10, 9, -3),
];

const constrainDigits = (digits: number[]): number[] => {
  for (const constraint of constraints) {
    const { index, relativeIndex, offset } = constraint;

    if (digits[relativeIndex] + offset > 10) {
      digits[relativeIndex] = 9 - offset;
    } else if (digits[relativeIndex] + offset < 0) {
      digits[relativeIndex] = -offset + 1;
    }
    digits[index] = digits[relativeIndex] + offset;
  }

  return digits;
};

const verifyAndConstrainModelNumber = (digits: number[]): number => {
  const constrainedDigits = constrainDigits(digits);
  // For the sake of fun, evaluate a JS version of the validation
  // algorithm and make sure we have a valid model number
  const isValid = loadVerificationAlgorithm();
  console.assert(isValid(constrainedDigits));
  return parseInt(constrainedDigits.join(''));
};

export const problem1 = () => verifyAndConstrainModelNumber(new Array(14).fill(9));
export const problem2 = () => verifyAndConstrainModelNumber(new Array(14).fill(1));
