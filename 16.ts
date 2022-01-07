import { parseInt, flatMap, sum, min, max, identity } from 'lodash-es';
import { readLines } from './loadData';

type BitSequence = {
  buffer: number[],
  index: number
};

const parseBuffer = (bits : BitSequence, numDigits: number) => {
  bits.index += numDigits;
  return bits.buffer.slice(bits.index - numDigits, bits.index);
};

const bufferToNum = (buf: number[]) => parseInt(buf.join(''), 2);
const parseNumber = (bits : BitSequence, numDigits: number) => bufferToNum(parseBuffer(bits, numDigits));

const parsePacket = (bits, visitor) => {
  const version = parseNumber(bits, 3);
  const type = parseNumber(bits, 3);
  visitor(version, type);

  if (type === 4) { // Literal packet
    let keepReading = true;
    const numberBuf: number[] = [];

    while (keepReading) {
      keepReading = parseNumber(bits, 1) === 1;
      numberBuf.push(...parseBuffer(bits, 4));
    }

    return bufferToNum(numberBuf);
  }

  // Operator packet
  const lengthTypeId = parseNumber(bits, 1);
  const components = [];

  if (lengthTypeId === 1) {
    for (let numSubPacketsLeft = parseNumber(bits, 11); numSubPacketsLeft > 0; numSubPacketsLeft--) {
      components.push(parsePacket(bits, visitor));
    }
  } else {
    const end = bits.index + parseNumber(bits, 15);

    while (bits.index < end) {
      components.push(parsePacket(bits, visitor));
    }
  }

  switch (type) {
    case 0: return sum(components);
    case 1: return components.reduce((product, component) => product * component, 1);
    case 2: return min(components);
    case 3: return max(components);
    case 5: return components[0] > components[1] ? 1 : 0;
    case 6: return components[0] < components[1] ? 1 : 0;
    case 7: return components[0] === components[1] ? 1 : 0;
    default: return 0;
  }
};

const parseBits = (line) => {
  const bits = flatMap(
    line.split('').map((character) => parseInt(character, 16)
      .toString(2)
      .padStart(4, '0')
      .split('')
      .map(parseInt)),
  );

  return { buffer: bits, index: 0 };
};

export const problem1 = () => {
  let versionSum = 0;
  const packetVisitor = (version) => {
    versionSum += version;
  };

  parsePacket(parseBits(readLines('16.txt')[0]), packetVisitor);

  return versionSum;
};

export const problem2 = () => parsePacket(parseBits(readLines('16.txt')[0]), identity);
